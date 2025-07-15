import UserContainer from './UserContainer';
import prisma from '../../../../../prisma/prisma';
import { UserCardData } from './UserCard';
import GetServerUser from '../../../../../libs/GetServerUser';

interface WrapperProps {
  searchParams?: { [key: string]: string | string[] | undefined };
}

const TOP_USERS_AMOUNT = 5;
const SELECT_SHUFFLED_USERS_AMOUNT = 15;

// Utility to shuffle an array for randomization
function shuffleArray<T>(array: T[]): T[] {
  return array
    .map((value) => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);
}

async function getUsersData(
  usernameQuery: string | undefined
): Promise<UserCardData[]> {
  const user = await GetServerUser();

  if (!user) {
    throw new Error('User not found');
  }

  type RawUser = {
    id: string;
    username: string;
    image: string | null;
    xp: number;
    Chest: { type: { name: string; chestImageUrl: string } }[];
    userRoom: { room: { rarity: string } }[];
  };

  let users: RawUser[];

  if (usernameQuery) {
    // Search results
    users = await prisma.user.findMany({
      where: {
        username: { contains: usernameQuery, mode: 'insensitive' },
        isActive: true,
      },
      select: {
        id: true,
        username: true,
        image: true,
        xp: true,
        Chest: {
          where: { opened: false },
          select: {
            type: {
              select: { name: true, chestImageUrl: true },
            },
          },
        },
        userRoom: {
          select: {
            room: {
              select: { rarity: true },
            },
          },
        },
      },
    });
  } else {
    //[RECOMMENDATION]: PICK 100 OF THE MOST XP USERS (topUsers variable) SHUFFLE THROUGH THEM AND USE ONLY SOME OF THEM,
    //BESIDES THE TOP USERS - GET USERS WHO HAVE XP <= USER_XP AND SHUFFLE THROUGH THEM AND PICK ONLY SOME OF THEM

    // Recommended users based on XP (<= current user's XP)
    const raw: RawUser[] = await prisma.user.findMany({
      where: {
        isActive: true,
        id: { not: user.id },
        xp: { lte: user.xp },
      },
      orderBy: { xp: 'desc' },
      take: 100,
      select: {
        id: true,
        username: true,
        image: true,
        xp: true,
        Chest: {
          where: { opened: false },
          select: { type: { select: { name: true, chestImageUrl: true } } },
        },
        userRoom: {
          select: { room: { select: { rarity: true } } },
        },
      },
    });

    const shuffled = shuffleArray(raw).slice(0, SELECT_SHUFFLED_USERS_AMOUNT);

    //Top users by xp
    const topUsers: RawUser[] = await prisma.user.findMany({
      where: {
        isActive: true,
        id: { notIn: [user.id, ...shuffled.map((item) => item.id)] },
      },
      orderBy: { xp: 'desc' },
      take: 100,
      select: {
        id: true,
        username: true,
        image: true,
        xp: true,
        Chest: {
          where: { opened: false },
          select: { type: { select: { name: true, chestImageUrl: true } } },
        },
        userRoom: {
          select: { room: { select: { rarity: true } } },
        },
      },
    });

    //Shuffle and pick some of them
    const topShuffled = shuffleArray(topUsers).slice(0, TOP_USERS_AMOUNT);

    users = [...topShuffled, ...shuffled];
  }

  return users.map<UserCardData>((user) => {
    const chests: Record<string, { count: number; chestImageUrl: string}> = {};
    user.Chest.forEach((c) => {
      const name = c.type.name.toLowerCase();
      chests[name] = {
        count: (chests[name]?.count || 0) + 1,
        chestImageUrl: c.type.chestImageUrl,
      };
    });

    const rarities: Record<string, number> = {};
    user.userRoom.forEach((ur) => {
      const rar = ur.room.rarity as string;
      rarities[rar] = (rarities[rar] || 0) + 1;
    });

    return {
      id: user.id,
      username: user.username,
      image: user.image,
      xp: user.xp,
      chests,
      rarities,
    } as UserCardData;
  });
}

const UsersWrapper = async ({ searchParams }: WrapperProps) => {
  const usernameParam =
    typeof searchParams?.username === 'string'
      ? searchParams.username
      : undefined;
  const users = await getUsersData(usernameParam);

  const heading = usernameParam ? 'Results' : 'Recommended users to trade with';

  return <UserContainer heading={heading} users={users} />;
};

export default UsersWrapper;
