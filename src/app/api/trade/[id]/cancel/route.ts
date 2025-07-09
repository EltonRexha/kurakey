import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../../../../prisma/prisma';
import GetServerUser from '../../../../../../libs/GetServerUser';

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
      OR: [{ sender: { id: user.id } }, { receiver: { id: user.id } }],
    },
  });

  if (trade?.status === 'COMPLETED') {
    return NextResponse.json(
      { error: 'Trade already completed' },
      { status: 400 }
    );
  }

  await prisma.$transaction(async (tx) => {
    const trade = await tx.trade.delete({
      where: {
        id,
        OR: [{ sender: { id: user.id } }, { receiver: { id: user.id } }],
      },
      include: {
        receiver: true,
        sender: true,
      },
    });

    const guest = trade.sender.id === user.id ? trade.receiver : trade.sender;

    await tx.notification.create({
      data: {
        type: 'OTHER',
        message: `You cancelled the trade with ${guest.username}`,
        user: {
          connect: {
            id: user.id,
          },
        },
      },
    });

    await tx.notification.create({
      data: {
        type: 'OTHER',
        message: `${user.username} cancelled the trade with you`,
        user: {
          connect: {
            id: guest.id,
          },
        },
      },
    });
  });

  return NextResponse.json({ message: 'Trade cancelled' }, { status: 200 });
}
