import { z } from 'zod';
import prisma from '../../../../../prisma/prisma';
import { NextResponse } from 'next/server';
import GetServerUser from '../../../../../libs/GetServerUser';
import { pickRoomByDropRates } from '../../../../../libs/pickRoomByDropRates';
import { awardAchievementIfNotUnlocked } from '../../../../../libs/achievements';

const schema = z.object({
  chestType: z.string(),
});

export async function POST(request: Request) {
  const json = await request.json();
  const body = schema.safeParse(json);

  if (body.error) {
    return NextResponse.json(body.error, { status: 400 });
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
      opened: false,
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

  const dropRates = chest.type.ChestDropRate;
  const room = await pickRoomByDropRates(dropRates);

  const allOpenedChests = await prisma.chest.findMany({
    where: {
      User: {
        id: user.id,
      },
      opened: true,
    },
  });

  //If the user has never opened a chest then give him an achievement
  if (allOpenedChests.length === 0) {
    await awardAchievementIfNotUnlocked({
      userId: user.id,
      achievementType: 'chestOpener',
      message: 'The journey begins.',
    });
  }

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
    prisma.chest.update({
      where: {
        id: chest.id,
      },
      data: {
        opened: true,
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

  //Room Explorer achievement
  const roomsAfter = await prisma.userRoom.findMany({
    where: {
      userId: user.id,
    },
    select: {
      roomId: true,
    },
  });
  const specificRooms = new Set(roomsAfter.map((r) => r.roomId)).size;

  if (specificRooms === 3) {
    await awardAchievementIfNotUnlocked({
      userId: user.id,
      achievementType: 'roomExplorer',
      message: "You've seen more than most",
    });
  }

  if (room.rarity === 'RARE' || room.rarity === 'EPIC') {
    await awardAchievementIfNotUnlocked({
      userId: user.id,
      achievementType: 'luckDrop',
      message: 'Not everyone pulls a room like that.',
    });
  }

  if (room.rarity === 'LEGENDARY' && room.category === 'VOID') {
    await awardAchievementIfNotUnlocked({
      userId: user.id,
      achievementType: 'voidBorn',
      message: "You've touched the edge of the unknown",
    });
  }

  const legendaryRooms = await prisma.userRoom.findMany({
    where: {
      user: {
        id: user.id,
      },
      room: {
        rarity: 'LEGENDARY',
      },
    },
  });

  if (legendaryRooms.length === 10) {
    await awardAchievementIfNotUnlocked({
      userId: user.id,
      achievementType: 'realityBreaker',
      message: "You didn't just peek beyond the veil - you shattered it.",
    });
  }

  if (room.rarity === 'SECRET' || room.isSecret) {
    await awardAchievementIfNotUnlocked({
      userId: user.id,
      achievementType: 'secretWitness',
      message: "What you saw wasn't meant for everyone.",
    });
  }

  return NextResponse.json(
    {
      message: `You opened ${room.name}`,
      room: room,
    },
    { status: 200 }
  );
}
