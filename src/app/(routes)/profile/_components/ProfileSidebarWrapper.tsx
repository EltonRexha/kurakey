import prisma from '../../../../../prisma/prisma';
import ProfileSidebar from './ProfileSidebar';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/authOptions';
import { redirect } from 'next/navigation';
import { RoomCategory, Rarity } from '@/generated/prisma';

interface ProfileSidebarWrapperProps {
  userId: string;
}

export default async function ProfileSidebarWrapper({
  userId,
}: ProfileSidebarWrapperProps) {
  // Get currently logged-in user to determine if viewing own profile
  const session = await getServerSession(authOptions);
  const loggedUserId = session?.user?.id;

  // Fetch user with achievements
  const dbUser = await prisma.user.findUnique({
    where: { id: userId },
    include: { achievements: true, userRoom: { include: { room: true } } },
  });

  if (!dbUser) {
    redirect('/not-found');
  }

  // Derive unlocked categories
  const categoriesSet = new Set<RoomCategory>();
  const raritiesSet = new Set<Rarity>();
  dbUser.userRoom.forEach((ur) => {
    categoriesSet.add(ur.room.category as RoomCategory);
    raritiesSet.add(ur.room.rarity as Rarity);
  });

  return (
    <ProfileSidebar
      username={dbUser.username}
      imageUrl={dbUser.image ?? '/placeholder-avatar.png'}
      xp={dbUser.xp}
      achievements={dbUser.achievements}
      joined={dbUser.createdAt.toISOString()}
      isLoggedUser={loggedUserId === userId}
      categories={[...categoriesSet] as RoomCategory[]}
      rarities={[...raritiesSet] as Rarity[]}
      id={dbUser.id}
    />
  );
}
