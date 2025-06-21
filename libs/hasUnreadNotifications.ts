import prisma from '../prisma/prisma';

export default async function hasUnreadNotifications(
  userId: string
): Promise<boolean> {
  if (!userId) return false;
  const count = await prisma.notification.count({
    where: { userId, isRead: false },
  });
  return count > 0;
}
