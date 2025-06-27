import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/authOptions';
import prisma from '../../../../prisma/prisma';

export async function PATCH(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.id) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const jsonBody = await request.json();

  if (!jsonBody.image || typeof jsonBody.image !== 'string') {
    return NextResponse.json({ message: 'Invalid image' }, { status: 400 });
  }

  try {
    const updated = await prisma.user.update({
      where: { id: session.user.id },
      data: { image: jsonBody.image },
      select: { id: true, image: true },
    });

    return NextResponse.json({ message: 'Image updated', user: updated });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
