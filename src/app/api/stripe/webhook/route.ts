import { NextRequest } from 'next/server';
import { default as stripe, default as Stripe } from 'stripe';
import prisma from '../../../../../prisma/prisma';
import { stripeApi } from '../../../../../libs/stripe/stripe-server';

const handleBundlePurchase = async (
  userId: string,
  bundleTypeId: string,
  sessionId: string,
  eventId: string
) => {
  const bundleType = await prisma.bundleType.findUnique({
    where: {
      id: bundleTypeId,
    },
    include: {
      BundleTypeChestType: true,
    },
  });

  if (!bundleType) {
    throw new Error('Bundle not found');
  }

  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!user) {
    throw new Error('User not found');
  }

  await prisma.$transaction(
    async (tx) => {
      //Create user bundle
      const bundle = await tx.bundle.create({
        data: {
          User: {
            connect: {
              id: userId,
            },
          },
          type: {
            connect: {
              id: bundleTypeId,
            },
          },
        },
      });

      //Give user the coins
      await tx.user.update({
        where: {
          id: userId,
        },
        data: {
          coinBalance: {
            increment: bundleType.coinAmount,
          },
        },
      });

      //Coin transaction
      await tx.coinTransaction.create({
        data: {
          user: {
            connect: {
              id: userId,
            },
          },
          amount: bundleType.coinAmount,
          type: 'PURCHASE',
          bundle: {
            connect: {
              id: bundle.id,
            },
          },
        },
      });

      //Give user the chests
      for (const type of bundleType.BundleTypeChestType) {
        for (let i = 0; i < type.amount; i++) {
          //Create chest
          await tx.chest.create({
            data: {
              User: {
                connect: {
                  id: userId,
                },
              },
              type: {
                connect: {
                  id: type.chestTypeId,
                },
              },
            },
          });
        }

        const chestType = await tx.chestType.findUnique({
          where: {
            id: type.chestTypeId,
          },
          select: {
            name: true,
          },
        });

        //Add notification for the chests
        await tx.notification.create({
          data: {
            user: {
              connect: {
                id: userId,
              },
            },
            type: 'CHEST_RECEIVED',
            message: `${type.amount}x ${chestType?.name} has been added to your account`,
            chestType: {
              connect: {
                id: type.chestTypeId,
              },
            },
          },
        });
      }

      //Add notification for the coins
      await tx.notification.create({
        data: {
          user: {
            connect: {
              id: userId,
            },
          },
          coinAmount: bundleType.coinAmount,
          type: 'COIN_RECEIVED',
          message: `You have received ${bundleType.coinAmount} coins!`,
        },
      });

      //Update the stripe payment
      const stripePayment = await tx.stripePayments.update({
        where: {
          sessionId: sessionId,
        },
        data: {
          status: 'COMPLETED',
        },
      });

      //Add processed event
      await tx.stripeEvents.create({
        data: {
          eventId: eventId,
          StripePayments: {
            connect: {
              id: stripePayment.id,
            },
          },
        },
      });
    },
    {
      timeout: 10000,
    }
  );
};

const handleCoinPackagePurchase = async (
  userId: string,
  coinPackageId: string,
  sessionId: string,
  eventId: string
) => {
  const coinPackage = await prisma.coinPackage.findUnique({
    where: {
      id: coinPackageId,
    },
  });

  if (!coinPackage) {
    throw new Error('Coin package not found');
  }

  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!user) {
    throw new Error('User not found');
  }

  await prisma.$transaction(
    async (tx) => {
      const coinAmount = coinPackage.baseCoins + coinPackage.bonusCoins;

      //Give user the coins
      await tx.user.update({
        where: {
          id: userId,
        },
        data: {
          coinBalance: {
            increment: coinAmount,
          },
        },
      });

      //Coin transaction
      const coinTransaction = await tx.coinTransaction.create({
        data: {
          user: {
            connect: {
              id: userId,
            },
          },
          amount: coinAmount,
          type: 'PURCHASE',
        },
      });

      //Create user coin package
      await tx.userCoinPackage.create({
        data: {
          user: {
            connect: {
              id: userId,
            },
          },
          package: {
            connect: {
              id: coinPackageId,
            },
          },
          transaction: {
            connect: {
              id: coinTransaction.id,
            },
          },
        },
      });

      //Add notification for the coins
      await tx.notification.create({
        data: {
          user: {
            connect: {
              id: userId,
            },
          },
          coinAmount: coinAmount,
          type: 'COIN_RECEIVED',
          message: `You have received ${coinAmount} coins!`,
        },
      });

      //Update the stripe payment
      const stripePayment = await tx.stripePayments.update({
        where: {
          sessionId: sessionId,
        },
        data: {
          status: 'COMPLETED',
        },
      });

      //Add processed event
      await tx.stripeEvents.create({
        data: {
          eventId: eventId,
          StripePayments: {
            connect: {
              id: stripePayment.id,
            },
          },
        },
      });
    },
    {
      timeout: 10000,
    }
  );
};

export async function POST(request: NextRequest) {
  const body = await request.text();
  const headers = await request.headers;

  const stripeSignature = headers.get('stripe-signature');
  const webhookSigningSecret = process.env.STRIPE_WEBHOOK_SIGNING_SECRET!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      stripeSignature!,
      webhookSigningSecret
    );
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (err) {
    return new Response('Invalid signature', { status: 400 });
  }

  if (event.type !== 'checkout.session.completed') {
    return new Response('Unhandled event type', { status: 200 });
  }

  const session = event.data.object as Stripe.Checkout.Session;
  const userId = session.metadata?.userId;
  const bundleTypeId = session.metadata?.bundleTypeId;
  const coinPackageId = session.metadata?.coinPackageId;

  const paymentIntentId = session.payment_intent as string;
  console.log({paymentIntentId});

  const paymentIntent = await stripeApi.paymentIntents.retrieve(
    paymentIntentId
  );
  const chargeId = paymentIntent.latest_charge as string;
  console.log({chargeId});

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
        await handleBundlePurchase(userId, bundleTypeId, session.id, event.id);
      } else if (coinPackageId) {
        await handleCoinPackagePurchase(
          userId,
          coinPackageId,
          session.id,
          event.id
        );
      } else {
        throw new Error('Missing bundleTypeId or coinPackageId');
      }
    } catch (error) {
      console.error('Webhook async error:', error);
      await prisma.stripePayments.update({
        where: { sessionId: session.id },
        data: { status: 'FAILED' },
      });
    }
  })();

  return stripeResponse;
}
