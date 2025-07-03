import { NextResponse } from 'next/server';
import GetServerUser from '../../../../libs/GetServerUser';
import getLevel, { MIN_LEVEL_TRADE } from '../../../../libs/getLevel';
import { z } from 'zod';
import prisma from '../../../../prisma/prisma';
import { subDays } from 'date-fns';

const CreateTradeSchema = z.object({
  receiverUserId: z.string(),
});

const DAYS_COOL_DOWN_RESET = 3;
const COOL_DOWN_TRADES_AMOUNT = 2;

export async function POST(request: Request) {
  const user = await GetServerUser();

  if (!user) {
    return NextResponse.json({ message: 'unauthorized' }, { status: 401 });
  }

  const level = getLevel(user.xp);

  if (level < MIN_LEVEL_TRADE) {
    return NextResponse.json(
      { message: `You must be ${level} to trade` },
      { status: 400 }
    );
  }

  const json = await request.json();
  const body = CreateTradeSchema.safeParse(json);

  if (body.error) {
    return NextResponse.json(body.error, { status: 400 });
  }

  const { receiverUserId } = body.data;

  const threeDaysAgo = subDays(new Date(), DAYS_COOL_DOWN_RESET);

  //Trades these 3 days
  const trades = await prisma.trade.findMany({
    where: {
      receiver: {
        id: receiverUserId,
      },
      createdAt: {
        gte: threeDaysAgo,
      },
    },
  });

  if (trades.length >= COOL_DOWN_TRADES_AMOUNT) {
    return NextResponse.json(
      {
        message: `Too many trades sent, try again later!`,
      },
      { status: 400 }
    );
  }

  const trade = await prisma.trade.create({
    data: {
      sender: {
        connect: {
          id: user.id,
        },
      },
      receiver: {
        connect: {
          id: receiverUserId,
        },
      },
    },
  });

  return NextResponse.json(
    {
      message: 'Trade successfully created',
      tradeId: trade.id,
    },
    { status: 200 }
  );
}
