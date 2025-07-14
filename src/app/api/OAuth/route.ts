import { OAuthUserSchema } from '@/schemas/oauthUserSchema';
import { NextResponse } from 'next/server';
import prisma from '../../../../prisma/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/authOptions';
import { stripeApi } from '../../../../libs/stripe/stripe-server';

export async function POST(request: Request) {
  const jsonBody = await request.json();

  const session = await getServerSession(authOptions);
  const OAuthSession = session?.oauthProfile;

  if (!OAuthSession) {
    return NextResponse.json(
      {
        message: 'your session is not a OAuth session',
      },
      { status: 403 }
    );
  }

  const parsedData = OAuthUserSchema.safeParse(jsonBody);

  if (parsedData.error) {
    return NextResponse.json(parsedData.error, { status: 400 });
  }

  const data = parsedData.data;

  //If user with this email exists
  const userWithEmail = await prisma.user.findUnique({
    where: {
      email: data.email,
    },
  });

  if (userWithEmail) {
    return NextResponse.json(
      { message: 'user with this email already exists' },
      { status: 400 }
    );
  }

  //if user with this username exists
  const userWithUsername = await prisma.user.findUnique({
    where: {
      username: data.username,
    },
  });

  if (userWithUsername) {
    return NextResponse.json(
      { message: 'user with this username already exists' },
      { status: 400 }
    );
  }

  await prisma.$transaction(async (tx) => {
    const user = await tx.user.create({
      data: {
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        username: data.username,
        emailVerified: new Date(),
        image: data.image,
      },
    });

    const customer = await stripeApi.customers.create({
      email: user.email,
      metadata: { internalUserId: user.id },
    });

    await tx.user.update({
      where: { id: user.id },
      data: { stripeCustomerId: customer.id },
    });
  });

  return NextResponse.json(
    {
      message: 'User successfully created',
      email: data.email,
    },
    {
      status: 201,
    }
  );
}
