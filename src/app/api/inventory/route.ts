import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../../prisma/prisma';
import GetServerUser from '../../../../libs/GetServerUser';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function GET(request: NextRequest) {
  const user = await GetServerUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const inventory = await prisma.user.findMany({
    where: {
      id: user.id,
    },
    select: {
      Chest: {
        include: {
          type: true,
        },
      },
      userRoom: {
        include: {
          room: true,
        },
      },
    },
  });

  return NextResponse.json(
    {
      message: 'Inventory fetched successfully',
      inventory,
    },
    { status: 200 }
  );
}
