import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../../../prisma/prisma';

export async function POST(req: NextRequest) {
  const { id } = await req.json();
  if (!id) {
    return NextResponse.json(
      { error: 'Missing notification id' },
      { status: 400 }
    );
  }
  await prisma.notification.update({
    where: { id },
    data: { isRead: true },
  });
  return NextResponse.json({ success: true });
}
