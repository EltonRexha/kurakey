import { NextResponse } from 'next/server';
import GetServerUser from '../../../../../libs/GetServerUser';
import prisma from '../../../../../prisma/prisma';
import PutTradeSchema from '@/schemas/putTradeSchema';

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
    },
    include: {
      receiver: true,
      sender: true,
      receiverChests: {
        include: {
          type: {
            select: {
              name: true,
              chestImageUrl: true,
            },
          },
        },
      },
      senderChests: {
        include: {
          type: {
            select: {
              name: true,
              chestImageUrl: true,
            },
          },
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

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();
  const parsedBody = PutTradeSchema.safeParse(body);

  if (parsedBody.error) {
    return NextResponse.json(parsedBody.error, { status: 400 });
  }

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
  });

  if (!trade) {
    return NextResponse.json({ message: 'trade not found' }, { status: 404 });
  }

  const userReady =
    trade.senderId === user.id ? trade.senderReady : trade.receiverReady;

  if (userReady) {
    return NextResponse.json(
      { message: 'User is ready, must be marked as not ready first' },
      { status: 400 }
    );
  }

  const userConfirmed =
    trade.senderId === user.id
      ? trade.senderConfirmed
      : trade.receiverConfirmed;

  if (userConfirmed) {
    return NextResponse.json(
      { message: 'trade already confirmed' },
      { status: 400 }
    );
  }

  // -------------------------------------------
  // Gather chest & room IDs based on quantities
  // -------------------------------------------

  const chestIdsToConnect: string[] = [];
  for (const { chestTypeId, quantity } of parsedBody.data.chests) {
    const chests = await prisma.chest.findMany({
      where: {
        userId: user.id,
        chestTypeId,
        opened: false,
      },
      select: {
        id: true,
      },
      take: quantity,
    });

    if (chests.length < quantity) {
      return NextResponse.json(
        { message: `Insufficient chests of type ${chestTypeId} to trade` },
        { status: 400 }
      );
    }

    chestIdsToConnect.push(...chests.map((c) => c.id));
  }

  const roomIdsToConnect: string[] = [];
  for (const { roomId, quantity } of parsedBody.data.rooms) {
    const rooms = await prisma.userRoom.findMany({
      where: {
        userId: user.id,
        room: {
          id: roomId,
        },
      },
      select: {
        id: true,
      },
      take: quantity,
    });

    if (rooms.length < quantity) {
      return NextResponse.json(
        { message: `Insufficient rooms of type ${roomId} to trade` },
        { status: 400 }
      );
    }

    roomIdsToConnect.push(...rooms.map((r) => r.id));
  }

  // -------------------------------------------------
  // Replace user-side items in trade with new ones
  // -------------------------------------------------

  const isSender = trade.senderId === user.id;

  await prisma.trade.update({
    where: { id },
    data: {
      senderReady: false,
      receiverReady: false,
      senderConfirmed: false,
      receiverConfirmed: false,
      ...(isSender
        ? {
            senderChests: { set: chestIdsToConnect.map((id) => ({ id })) },
            senderRooms: { set: roomIdsToConnect.map((id) => ({ id })) },
          }
        : {
            receiverChests: { set: chestIdsToConnect.map((id) => ({ id })) },
            receiverRooms: { set: roomIdsToConnect.map((id) => ({ id })) },
          }),
    },
  });

  return NextResponse.json({ message: 'Trade updated' }, { status: 200 });
}
