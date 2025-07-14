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

  const bundleType = await prisma.bundleType.findUnique({
    where: { id },
  });

  if (!bundleType) {
    return NextResponse.json({ error: 'Bundle not found' }, { status: 404 });
  }

  if (!bundleType.stripePriceId) {
    return NextResponse.json(
      { error: 'Bundle Type has no stripe price id' },
      { status: 400 }
    );
  }

  if (!user.stripeCustomerId) {
    return NextResponse.json(
      { error: 'User has no stripe customer id' },
      { status: 400 }
    );
  }

  const stripeSession = await stripeApi.checkout.sessions.create({
    customer: user.stripeCustomerId,
    line_items: [
      {
        price: bundleType.stripePriceId,
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/store?success=true&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/store?success=false&session_id={CHECKOUT_SESSION_ID}`,
    metadata: {
      userId: user.id,
      bundleTypeId: bundleType.id,
    },
  });

  return NextResponse.json({ checkoutSessionId: stripeSession.id });
}
