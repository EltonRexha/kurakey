import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../../prisma/prisma';
import GetServerUser from '../../../../libs/GetServerUser';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const user = await GetServerUser();
  const page = parseInt(searchParams.get('page') || '1', 10);
  const pageSize = parseInt(searchParams.get('pageSize') || '10', 10);

  if (!user || !user.id) {
    return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
  }

  const skip = (page - 1) * pageSize;

  const notifications = await prisma.notification.findMany({
    where: {
      user: {
        id: user.id,
      },
    },
    orderBy: { createdAt: 'desc' },
    include: {
      chestType: true,
      room: true,
    },
    skip,
    take: pageSize,
  });

  const total = await prisma.notification.count({
    where: {
      user: {
        id: user.id,
      },
    },
  });

  return NextResponse.json({
    notifications,
    total,
    page,
    pageSize,
    hasMore: skip + notifications.length < total,
  });
}
