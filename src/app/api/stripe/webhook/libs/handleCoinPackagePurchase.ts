import prisma from '../../../../../../prisma/prisma';

const COIN_PACKAGE_XP_AMOUNT = 100;

export default async function handleCoinPackagePurchase(
  userId: string,
  coinPackageId: string,
  sessionId: string,
  eventId: string,
  paymentIntentId: string,
  chargeId: string,
  stripeCustomerId: string
) {
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

  if (user.stripeCustomerId !== stripeCustomerId) {
    throw new Error('Stripe customer does not match user');
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
          xp: {
            increment: COIN_PACKAGE_XP_AMOUNT,
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
      const userCoinPackage = await tx.userCoinPackage.create({
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

      //Xp notification
      await tx.notification.create({
        data: {
          user: {
            connect: { id: userId },
          },
          type: 'XP_GAIN',
          message: `${COIN_PACKAGE_XP_AMOUNT}xp has been added to your account`,
          xpAmount: COIN_PACKAGE_XP_AMOUNT,
        },
      });

      //Update or create the stripe payment
      const stripePayment = await tx.stripePayments.upsert({
        where: {
          sessionId: sessionId,
        },
        update: {
          status: 'COMPLETED',
          paymentIntentId,
          chargeId,
          sessionId,
          user: {
            connect: {
              id: userId,
            },
          },
          userCoinPackage: {
            connect: {
              id: userCoinPackage.id,
            },
          },
          coinPackage: {
            connect: {
              id: coinPackageId,
            },
          },
        },
        create: {
          status: 'COMPLETED',
          paymentIntentId,
          chargeId,
          sessionId,
          user: {
            connect: {
              id: userId,
            },
          },
          userCoinPackage: {
            connect: {
              id: userCoinPackage.id,
            },
          },
          coinPackage: {
            connect: {
              id: coinPackageId,
            },
          },
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
      timeout: 20000,
    }
  );
}
