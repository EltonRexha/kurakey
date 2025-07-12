import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../../../../../prisma/prisma';
import GetServerUser from '../../../../../../../libs/GetServerUser';
import { stripeApi } from '../../../../../../../libs/stripe/stripe-server';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const user = await GetServerUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const bundle = await prisma.bundle.findUnique({
    where: { id },
  });

  if (!bundle) {
    return NextResponse.json({ error: 'Bundle not found' }, { status: 404 });
  }

  if (!bundle.stripePriceId) {
    return NextResponse.json(
      { error: 'Bundle has no stripe price id' },
      { status: 400 }
    );
  }

  const stripeSession = await stripeApi.checkout.sessions.create({
    line_items: [
      {
        price: bundle.stripePriceId,
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/store?success=true&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/store?success=false&session_id={CHECKOUT_SESSION_ID}`,
    metadata: {
      userId: user.id,
      bundleId: bundle.id,
    },
  });

  await prisma.stripePayments.create({
    data: {
      user: {
        connect: {
          id: user.id,
        },
      },
      bundle: {
        connect: {
          id: bundle.id,
        },
      },
      sessionId: stripeSession.id,
      status: 'PENDING',
    },
  });

  return NextResponse.json({ checkoutSessionId: stripeSession.id });
}
