import { NextRequest } from 'next/server';
import { default as stripe, default as Stripe } from 'stripe';
import prisma from '../../../../../prisma/prisma';

const handleBundlePurchase = async (
  userId: string,
  bundleTypeId: string,
  sessionId: string
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

  await prisma.$transaction(async (tx) => {
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
      Array.from({ length: type.amount }).forEach(async () => {
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
      });

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
    await tx.stripePayments.update({
      where: {
        sessionId: sessionId,
      },
      data: {
        status: 'COMPLETED',
      },
    });
  }, {
    timeout: 10000,
  });
};

const handleCoinPackagePurchase = async (
  userId: string,
  coinPackageId: string,
  sessionId: string
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

  await prisma.$transaction(async (tx) => {
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

    //Update the stripe payment
    await tx.stripePayments.update({
      where: {
        sessionId: sessionId,
      },
      data: {
        status: 'COMPLETED',
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
  }, {
    timeout: 10000,
  });
};

export async function POST(request: NextRequest) {
  const body = await request.text();
  const headers = await request.headers;

  if (!process.env.STRIPE_WEBHOOK_SIGNING_SECRET) {
    return new Response('Missing stripe webhook signing secret', {
      status: 500,
    });
  }

  const webhookSigningSecret = process.env.STRIPE_WEBHOOK_SIGNING_SECRET!;
  const stripeSignature = headers.get('stripe-signature');

  if (!stripeSignature) {
    return new Response('Missing stripe signature', { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      stripeSignature,
      webhookSigningSecret
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return new Response(
      `Webhook Error: ${err instanceof Error ? err.message : 'Unknown error'}`,
      {
        status: 400,
      }
    );
  }

  if (event.type !== 'checkout.session.completed') {
    return new Response(`Unhandled event type: ${event.type}`, { status: 400 });
  }

  const checkoutSession = event.data.object as Stripe.Checkout.Session;

  try {
    const userId = checkoutSession.metadata?.userId;
    const bundleTypeId = checkoutSession.metadata?.bundleTypeId;
    const coinPackageId = checkoutSession.metadata?.coinPackageId;

    if (!userId) {
      throw new Error('Missing user ID');
    }

    if (bundleTypeId) {
      await handleBundlePurchase(userId, bundleTypeId, checkoutSession.id);
    }

    if (coinPackageId) {
      await handleCoinPackagePurchase(
        userId,
        coinPackageId,
        checkoutSession.id
      );
    }

    if (!bundleTypeId && !coinPackageId) {
      throw new Error('Missing bundle type ID or coin package ID');
    }

    return new Response('Payment processed successfully', { status: 200 });
  } catch (error) {
    //Update the stripe payment
    await prisma.stripePayments.update({
      where: {
        sessionId: checkoutSession.id,
      },
      data: {
        status: 'FAILED',
      },
    });

    console.error('Payment processing failed:', error);
    return new Response('Internal server error', { status: 500 });
  }
}
