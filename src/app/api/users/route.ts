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

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const id = searchParams.get('id');
  const username = searchParams.get('username');
  const email = searchParams.get('email');
  const page = Number(searchParams.get('page')) || 1;
  const limit = Number(searchParams.get('limit')) || 10;
  const skip = (page - 1) * limit;

  const whereClause = {
    OR: [
      ...(id ? [{ id }] : []),
      ...(username ? [{ username: { contains: username } }] : []),
      ...(email ? [{ email: { contains: email } }] : []),
    ],
  };

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where: whereClause,
      select: {
        id: true,
        username: true,
        email: true,
        firstName: true,
        lastName: true,
        image: true,
      },
      skip,
      take: limit,
    }),
    prisma.user.count({ where: whereClause }),
  ]);

  return NextResponse.json({
    users,
    pagination: {
      total,
      pages: Math.ceil(total / limit),
      currentPage: page,
      limit,
    },
  });
}
