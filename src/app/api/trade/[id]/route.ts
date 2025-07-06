import { NextResponse } from 'next/server';
import GetServerUser from '../../../../../libs/GetServerUser';
import prisma from '../../../../../prisma/prisma';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

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
      status: 'PENDING',
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

  // derive user vs guest perspective
  const isSender = trade.senderId === user.id;

  const responseBody = {
    id: trade.id,
    user: isSender ? trade.sender : trade.receiver,
    guest: isSender ? trade.receiver : trade.sender,
    userChests: isSender ? trade.senderChests : trade.receiverChests,
    guestChests: isSender ? trade.receiverChests : trade.senderChests,
    userRooms: isSender ? trade.senderRooms : trade.receiverRooms,
    guestRooms: isSender ? trade.receiverRooms : trade.senderRooms,
    userReady: isSender ? trade.senderReady : trade.receiverReady,
    guestReady: isSender ? trade.receiverReady : trade.senderReady,
    userConfirmed: isSender ? trade.senderConfirmed : trade.receiverConfirmed,
    guestConfirmed: isSender ? trade.receiverConfirmed : trade.senderConfirmed,
    status: trade.status,
  };

  return NextResponse.json(responseBody);
}
