import prisma from '../prisma/prisma';

/**
 * Awards an achievement to the specified user if they don't already have it.
 * A notification of type `ACHIEVEMENT` is also created for the user.
 *
 * @param params.userId          ID of the user who may earn the achievement
 * @param params.achievementType The `type` field of the `Achievement` model
 * @param params.message         Notification message shown to the user
 * @returns `true` if the achievement was awarded, `false` if the user already had it
 */
export async function awardAchievementIfNotUnlocked(params: {
  userId: string;
  achievementType: string;
  message: string;
}): Promise<boolean> {
  const { userId, achievementType, message } = params;

  // Check if the user already owns this achievement
  const hasAchievement = await prisma.user.findFirst({
    where: {
      id: userId,
      achievements: {
        some: {
          type: achievementType,
        },
      },
    },
    select: { id: true },
  });

  if (hasAchievement) {
    return false;
  }

  // Give the achievement and create a notification atomically
  await prisma.$transaction([
    prisma.user.update({
      where: { id: userId },
      data: {
        achievements: {
          connect: { type: achievementType },
        },
      },
    }),
    prisma.notification.create({
      data: {
        message,
        type: 'ACHIEVEMENT',
        user: {
          connect: { id: userId },
        },
        achievement: {
          connect: { type: achievementType },
        },
      },
    }),
  ]);

  return true;
}
