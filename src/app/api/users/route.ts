import { NextResponse } from 'next/server';
import { UserSchema } from '@/schemas/userSchema';
import bcrypt from 'bcrypt';
import prisma from '../../../../prisma/prisma';

export async function POST(request: Request) {
  const jsonBody = await request.json();
  const body = UserSchema.safeParse(jsonBody);

  if (!body.success) {
    return NextResponse.json(body.error, { status: 400 });
  }

  const { email, firstName, lastName, username, password, image } = body.data;

  //If user with this email exists
  const userWithEmail = await prisma.user.findUnique({
    where: {
      email,
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
      username,
    },
  });

  if (userWithUsername) {
    return NextResponse.json(
      { message: 'user with this email already exists' },
      { status: 400 }
    );
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const createdUser = await prisma.user.create({
    data: {
      email,
      firstName,
      lastName,
      username,
      password: hashedPassword,
      image,
    },
  });

  return NextResponse.json(
    {
      message: 'User successfully created',
      email: createdUser.email,
    },
    {
      status: 201,
    }
  );
}
