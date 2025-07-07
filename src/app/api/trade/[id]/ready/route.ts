import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../../../../prisma/prisma';
import GetServerUser from '../../../../../../libs/GetServerUser';
import { z } from 'zod';

const schema = z.object({
  ready: z.boolean(),
});

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await req.json();
  const parsedBody = schema.safeParse(body);

  if (parsedBody.error) {
    return NextResponse.json(parsedBody.error, { status: 400 });
  }

  const user = await GetServerUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const trade = await prisma.trade.findUnique({
    where: {
      id,
      OR: [
        {
          sender: {
            id: user.id,
          },
        },
        {
          receiver: {
            id: user.id,
          },
        },
      ],
      status: 'PENDING',
    },
  });

  if (!trade) {
    return NextResponse.json({ error: 'Trade not found' }, { status: 404 });
  }

  const isSender = trade.senderId === user.id;

  if (parsedBody.data.ready === false) {
    await prisma.trade.update({
      where: { id },
      data: {
        receiverReady: false,
        senderReady: false,
        receiverConfirmed: false,
        senderConfirmed: false,
      },
    });
  } else {
    await prisma.trade.update({
      where: { id },
      data: {
        [isSender ? 'senderReady' : 'receiverReady']: true,
      },
    });
  }

  return NextResponse.json(
    { message: 'Trade status updated' },
    { status: 200 }
  );
}
