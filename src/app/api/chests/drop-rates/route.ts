import { NextResponse } from 'next/server';
import prisma from '@/../prisma/prisma';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function GET(request: Request) {
  try {
    // Fetch all chest types and their drop rates
    const chestTypes = await prisma.chestType.findMany({
      select: {
        name: true,
        ChestDropRate: {
          select: {
            rarity: true,
            chance: true,
          },
        },
      },
    });

    // Format as { [chestName]: [{rarity, chance}, ...] }
    const odds: Record<string, { rarity: string; chance: number }[]> = {};
    for (const chest of chestTypes) {
      odds[chest.name] = chest.ChestDropRate.map((drop) => ({
        rarity: drop.rarity,
        chance: drop.chance,
      }));
    }

    return NextResponse.json({ odds }, { status: 200 });
  } catch (error: unknown) {
    let message = 'Unknown error';

    if (
      typeof error === 'object' &&
      error &&
      'message' in error &&
      typeof error.message === 'string'
    ) {
      message = error.message;
    }
    return NextResponse.json({ message: message }, { status: 500 });
  }
}
