import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../../prisma/prisma';
import GetServerUser from '../../../../libs/GetServerUser';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function GET(request: NextRequest) {
  const user = await GetServerUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const chests = await prisma.chest.findMany({
    where: {
      User: {
        id: user.id,
      },
      opened: false,
    },
    include: {
      type: true,
    },
  });

  const userRooms = await prisma.userRoom.findMany({
    where: {
      user: {
        id: user.id,
      },
    },
    include: {
      room: true,
    },
  });

  const inventory = {
    chests,
    userRooms,
  };

  return NextResponse.json(
    {
      message: 'Inventory fetched successfully',
      inventory,
    },
    { status: 200 }
  );
}
