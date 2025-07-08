import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../../../../prisma/prisma';
import GetServerUser from '../../../../../../libs/GetServerUser';
import { Chest, Trade, User, UserRoom } from '@/generated/prisma';

async function finishTrade(
  trade: Trade & {
    sender: User;
    receiver: User;
    senderChests: Chest[];
    receiverChests: Chest[];
    senderRooms: UserRoom[];
    receiverRooms: UserRoom[];
  }
) {
  const { senderChests, receiverChests, senderRooms, receiverRooms } = trade;

  await prisma.$transaction(async (tx) => {
    //Change the connection of the chests and rooms of the receiver to the sender

    await tx.chest.updateMany({
      where: {
        id: {
          in: receiverChests.map((chest) => chest.id),
        },
      },
      data: {
        userId: trade.senderId,
      },
    });

    await tx.userRoom.updateMany({
      where: {
        id: {
          in: receiverRooms.map((room) => room.id),
        },
      },
      data: {
        userId: trade.senderId,
      },
    });

    //Change the connection of the chests and rooms of the sender to the receiver

    await tx.chest.updateMany({
      where: {
        id: {
          in: senderChests.map((chest) => chest.id),
        },
      },
      data: {
        userId: trade.receiverId,
      },
    });

    await tx.userRoom.updateMany({
      where: {
        id: {
          in: senderRooms.map((room) => room.id),
        },
      },
      data: {
        userId: trade.receiverId,
      },
    });

    await tx.notification.create({
      data: {
        message: `Trade Completed with ${trade.sender.username}`,
        type: 'OTHER',
        trade: {
          connect: {
            id: trade.id,
          },
        },
        user: {
          connect: {
            id: trade.receiverId,
          },
        },
      },
    });

    await tx.notification.create({
      data: {
        message: `Trade Completed with ${trade.receiver.username}`,
        type: 'OTHER',
        trade: {
          connect: {
            id: trade.id,
          },
        },
        user: {
          connect: {
            id: trade.senderId,
          },
        },
      },
    });

    await tx.trade.update({
      where: { id: trade.id },
      data: {
        status: 'COMPLETED',
        senderConfirmed: true,
        receiverConfirmed: true,
      },
    });
  });
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const user = await GetServerUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
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
      sender: true,
      receiver: true,
      senderChests: true,
      receiverChests: true,
      senderRooms: true,
      receiverRooms: true,
    },
  });

  if (!trade) {
    return NextResponse.json({ error: 'Trade not found' }, { status: 404 });
  }

  if (trade.status === 'COMPLETED') {
    return NextResponse.json(
      { error: 'Trade already completed' },
      { status: 400 }
    );
  }

  if (!trade.receiverReady || !trade.senderReady) {
    return NextResponse.json(
      { error: 'Both the receiver and sender need to be ready' },
      { status: 400 }
    );
  }

  const guestConfirmed =
    trade.receiverId === user.id
      ? trade.senderConfirmed
      : trade.receiverConfirmed;

  if (guestConfirmed) {
    //You need to finish the trade
    await finishTrade(trade);

    return NextResponse.json({ message: 'Trade completed' }, { status: 200 });
  }

  const isSender = trade.senderId === user.id;

  await prisma.trade.update({
    where: { id },
    data: {
      [isSender ? 'senderConfirmed' : 'receiverConfirmed']: true,
    },
  });

  return NextResponse.json(
    { message: 'Trade confirmed, waiting for the other user to confirm' },
    { status: 200 }
  );
}
