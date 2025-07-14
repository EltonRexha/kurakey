import prisma from '../../../../../../prisma/prisma';

export default async function handleBundlePurchase(
  userId: string,
  bundleTypeId: string,
  sessionId: string,
  eventId: string,
  paymentIntentId: string,
  chargeId: string,
  stripeCustomerId: string
) {
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

  if (user.stripeCustomerId !== stripeCustomerId) {
    throw new Error('Stripe customer does not match user');
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
          chests: {
            create: bundleType.BundleTypeChestType.map((type) => ({
              type: {
                connect: {
                  id: type.chestTypeId,
                },
              },
              User: {
                connect: {
                  id: userId,
                },
              },
            })),
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

      //Add notification for the chests
      await Promise.all(
        bundleType.BundleTypeChestType.map(async (type) => {
          const chestType = await tx.chestType.findUnique({
            where: { id: type.chestTypeId },
            select: { name: true },
          });

          await tx.notification.create({
            data: {
              user: {
                connect: { id: userId },
              },
              type: 'CHEST_RECEIVED',
              message: `${type.amount}x ${chestType?.name} has been added to your account`,
              chestType: {
                connect: { id: type.chestTypeId },
              },
            },
          });
        })
      );

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
          bundleType: {
            connect: {
              id: bundleTypeId,
            },
          },
          bundle: {
            connect: {
              id: bundle.id,
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
          bundleType: {
            connect: {
              id: bundleTypeId,
            },
          },
          bundle: {
            connect: {
              id: bundle.id,
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
