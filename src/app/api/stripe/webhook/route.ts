import { NextRequest } from 'next/server';
import { default as stripe, default as Stripe } from 'stripe';
import prisma from '../../../../../prisma/prisma';
import { stripeApi } from '../../../../../libs/stripe/stripe-server';
import handleBundlePurchase from './libs/handleBundlePurchase';
import handleCoinPackagePurchase from './libs/handleCoinPackagePurchase';

export async function POST(request: NextRequest) {
  const body = await request.text();
  const headers = await request.headers;

  const stripeSignature = headers.get('stripe-signature');

  if (!stripeSignature) {
    return new Response('Missing stripe signature', { status: 400 });
  }

  const webhookSigningSecret = process.env.STRIPE_WEBHOOK_SIGNING_SECRET!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      stripeSignature,
      webhookSigningSecret
    );
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (err) {
    return new Response('Invalid signature', { status: 400 });
  }

  if (event.type !== 'checkout.session.completed') {
    return new Response('Unhandled event type', { status: 200 });
  }

  const session = event.data.object;
  const userId = session.metadata?.userId;
  const bundleTypeId = session.metadata?.bundleTypeId;
  const coinPackageId = session.metadata?.coinPackageId;
  const stripeCustomerId = session.customer;

  if (!stripeCustomerId) {
    throw new Error('Missing stripe customer id');
  }

  const paymentIntentId = session.payment_intent as string;

  const paymentIntent = await stripeApi.paymentIntents.retrieve(
    paymentIntentId
  );
  const chargeId = paymentIntent.latest_charge as string;

  const stripeResponse = new Response('OK', { status: 200 });

  // Then process in background (not blocking Stripe)
  (async () => {
    try {
      if (!userId) throw new Error('Missing user ID');

      const alreadyHandled = await prisma.stripeEvents.findUnique({
        where: { eventId: event.id },
      });

      if (alreadyHandled) {
        throw new Error('Event already processed');
      }

      if (bundleTypeId) {
        await handleBundlePurchase(
          userId,
          bundleTypeId,
          session.id,
          event.id,
          paymentIntentId,
          chargeId,
          stripeCustomerId as string
        );
      } else if (coinPackageId) {
        await handleCoinPackagePurchase(
          userId,
          coinPackageId,
          session.id,
          event.id,
          paymentIntentId,
          chargeId,
          stripeCustomerId as string
        );
      } else {
        throw new Error('Missing bundleTypeId or coinPackageId');
      }
    } catch (error) {
      console.log('Error in stripe webhook', error);
      //Update or create the stripe payment
      await prisma.stripePayments.upsert({
        where: { sessionId: session.id },
        update: {
          sessionId: session.id,
          status: 'FAILED',
          paymentIntentId,
          chargeId,
          user: {
            connect: {
              id: userId,
            },
          },
          ...(bundleTypeId && {
            bundleType: {
              connect: {
                id: bundleTypeId,
              },
            },
          }),
          ...(coinPackageId && {
            coinPackage: {
              connect: {
                id: coinPackageId,
              },
            },
          }),
        },
        create: {
          sessionId: session.id,
          status: 'FAILED',
          paymentIntentId,
          chargeId,
          user: {
            connect: {
              id: userId,
            },
          },
          ...(bundleTypeId && {
            bundleType: {
              connect: {
                id: bundleTypeId,
              },
            },
          }),
          ...(coinPackageId && {
            coinPackage: {
              connect: {
                id: coinPackageId,
              },
            },
          }),
        },
      });
    }
  })();

  return stripeResponse;
}
