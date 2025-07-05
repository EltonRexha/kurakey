import { NextResponse } from 'next/server';
import GetServerUser from '../../../../../libs/GetServerUser';
import prisma from '../../../../../prisma/prisma';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ message: 'id is required' }, { status: 400 });
  }

  const user = await GetServerUser();

  if (!user) {
    return NextResponse.json({ message: 'unauthorized' }, { status: 401 });
  }

  const trade = await prisma.trade.findUnique({
    where: {
      id,
      OR: [
        {
          receiver: {
            id: user.id,
          },
        },
        {
          sender: {
            id: user.id,
          },
        },
      ],
    },
    include: {
      receiver: true,
      sender: true,
      receiverChests: {
        include: {
          type: true,
        },
      },
      senderChests: {
        include: {
          type: true,
        },
      },
      receiverRooms: {
        include: {
          room: true,
        },
      },
      senderRooms: {
        include: {
          room: true,
        },
      },
    },
  });

  if (!trade) {
    return NextResponse.json({ message: 'trade not found' }, { status: 404 });
  }

  return NextResponse.json(trade);
}
