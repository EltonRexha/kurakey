import { z } from 'zod';
import prisma from '../../../../../prisma/prisma';
import { NextResponse } from 'next/server';
import GetServerUser from '../../../../../libs/GetServerUser';
import { pickRoomByDropRates } from '../../../../../libs/pickRoomByDropRates';

const schema = z.object({
  chestType: z.string(),
});

export async function POST(request: Request) {
  const json = await request.json();
  const body = schema.safeParse(json);

  if (body.error) {
    return NextResponse.json(body.data, { status: 400 });
  }

  const user = await GetServerUser();

  if (!user) {
    return NextResponse.json(
      { message: 'You need to be authenticated to open a chest' },
      { status: 401 }
    );
  }

  const {
    data: { chestType },
  } = body;

  //Find a chest that the user has with this type
  const chest = await prisma.chest.findFirst({
    where: {
      User: {
        id: user.id,
      },
      type: {
        name: chestType,
      },
    },
    include: {
      type: {
        include: {
          ChestDropRate: true,
        },
      },
    },
  });

  if (!chest) {
    return NextResponse.json(
      { message: 'You need to own a chest to open a chest' },
      { status: 400 }
    );
  }

  // Pick a rarity based on the chest's drop rates
  const dropRates = chest.type.ChestDropRate;
  const room = await pickRoomByDropRates(dropRates);

  await prisma.$transaction([
    prisma.userRoom.create({
      data: {
        room: {
          connect: {
            id: room.id,
          },
        },
        user: {
          connect: {
            id: user.id,
          },
        },
      },
    }),
    prisma.chest.delete({
      where: {
        id: chest.id,
      },
    }),
    prisma.notification.create({
      data: {
        user: {
          connect: {
            id: user.id,
          },
        },
        room: {
          connect: {
            id: room.id,
          },
        },
        message: `You unlocked ${room.name}`,
        type: 'ROOM_RECEIVED',
      },
    }),
  ]);

  return NextResponse.json(
    {
      message: `You opened ${room.name}`,
      room: room,
    },
    { status: 200 }
  );
}
