import prisma from '../../../../../prisma/prisma';
import ChestGrid from './ChestGrid';

interface ChestGridWrapperProps {
  userId: string;
}

async function getUserChests(userId: string) {
  const chests = await prisma.chest.findMany({
    where: { userId, opened: false },
    include: {
      type: true,
    },
  });

  const chestMap: Record<string, { id: string; name: string; count: number }> =
    {};

  chests.forEach((chest) => {
    const { id, name } = chest.type;
    if (!chestMap[id]) {
      chestMap[id] = { id, name, count: 0 };
    }
    chestMap[id].count += 1;
  });

  return Object.values(chestMap);
}

// Server component
export default async function ChestGridWrapper({
  userId,
}: ChestGridWrapperProps) {
  const chests = await getUserChests(userId);
  return <ChestGrid chests={chests} />;
}
