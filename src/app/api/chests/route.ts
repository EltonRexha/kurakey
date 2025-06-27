import BuyChestSchema from "@/schemas/buyChestSchema";
import { NextResponse } from "next/server";
import GetServerUser from "../../../../libs/GetServerUser";
import prisma from "../../../../prisma/prisma";

//Function to buy chest
export async function POST(request: Request) {
  const json = await request.json();
  const body = BuyChestSchema.safeParse(json);

  if (body.error) {
    return NextResponse.json(body.data, { status: 400 });
  }

  const user = await GetServerUser();

  if (!user) {
    return NextResponse.json(
      { message: "You have to be authenticated to buy chests" },
      { status: 401 }
    );
  }

  const { amount, typeId } = body.data;

  const chestType = await prisma.chestType.findUnique({
    where: {
      id: typeId,
    },
  });

  if (!chestType) {
    return NextResponse.json(
      { message: "Could not find the chest" },
      { status: 404 }
    );
  }

  const totalPrice = chestType?.price * amount;

  if (user.coinBalance < totalPrice) {
    return NextResponse.json(
      {
        message: "insufficient coin balance",
      },
      { status: 400 }
    );
  }

  console.log(chestType);

  await prisma.$transaction([
    ...Array.from({ length: amount }).map(() =>
      prisma.chest.create({
        data: {
          type: { connect: { id: typeId } },
          User: { connect: { id: user.id } },
          opened: false,
        },
      })
    ),
    prisma.user.update({
      where: { id: user.id },
      data: {
        coinBalance: user.coinBalance - totalPrice,
        xp: user.xp + chestType.xpGain * amount,
      },
    }),
    prisma.coinTransaction.create({
      data: {
        user: { connect: { id: user.id } },
        amount: -totalPrice,
        type: "PURCHASE",
        chestType: {
          connect: {
            id: typeId,
          },
        },
      },
    }),
    prisma.notification.create({
      data: {
        message: `${chestType.xpGain}xp has been added to your account`,
        type: "XP_GAIN",
        isRead: false,
        xpAmount: chestType.xpGain,
        user: {
          connect: {
            id: user.id,
          },
        },
      },
    }),
    prisma.notification.create({
      data: {
        message: `${amount}x ${chestType.name} has been added to your account`,
        type: "CHEST_RECEIVED",
        isRead: false,
        chestType: {
          connect: {
            id: chestType.id,
          },
        },
        user: {
          connect: {
            id: user.id,
          },
        },
      },
    }),
  ]);

  return NextResponse.json(
    {
      message: "Successfully bought the coins",
      success: true,
      amount,
      xpGained: chestType.xpGain * amount,
    },
    { status: 201 }
  );
}
