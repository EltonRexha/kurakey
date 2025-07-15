'use client';
import Link from 'next/link';
import Image from 'next/image';
import LevelBar from '@/app/(routes)/profile/_components/LevelBar';
import getLevel, { MAX_LEVEL } from '@/../libs/getLevel';
import { rarityColors } from '@/utils/colors';

export interface UserCardData {
  id: string;
  username: string;
  xp: number;
  image: string | null;
  chests: Record<string, { count: number; chestImageUrl: string }>;
  rarities: Record<string, number>;
}

const UserCard: React.FC<{ user: UserCardData }> = ({ user }) => {
  const level = Number(getLevel(user.xp));
  const isMax = level >= MAX_LEVEL;
  const nextLevelXp = isMax ? user.xp : (level + 1) * 100;

  return (
    <Link
      href={`/profile?id=${user.id}`}
      className="block w-full sm:w-[250px] bg-[#11142d] rounded-lg overflow-hidden hover:scale-[1.02] transition-transform duration-200"
    >
      <div className="flex flex-col items-center p-4">
        <div className="relative w-24 h-24 mb-3 rounded-full overflow-hidden ring-4 ring-[#008cff]/50">
          <Image
            src={user.image || '/placeholder-avatar.png'}
            alt={user.username}
            fill
            className="object-cover"
          />
        </div>
        <h3 className="text-white font-medium text-lg mb-2 capitalize truncate">
          {user.username}
        </h3>
        <LevelBar
          level={level}
          xp={user.xp}
          nextLevelXp={nextLevelXp}
          isMax={isMax}
        />
        {/* Chests row */}
        {Object.keys(user.chests).length > 0 && (
          <div className="flex flex-wrap gap-1 mt-3 self-start">
            {Object.entries(user.chests).map(
              ([chestName, { count, chestImageUrl }]) => (
                <div
                  key={chestName}
                  className="flex items-center gap-1 text-[10px] font-semibold px-2 py-1 rounded bg-[#23224a] text-[#008cff]"
                >
                  <span>{count}x</span>
                  <Image
                    src={chestImageUrl}
                    alt={chestName}
                    width={18}
                    height={18}
                    className="object-contain"
                  />
                </div>
              )
            )}
          </div>
        )}
        {/* Rarities row */}
        {Object.keys(user.rarities).length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2 self-start">
            {Object.entries(user.rarities).map(([rar, count]) => (
              <span
                key={rar}
                className="text-[10px] font-semibold px-2 py-0.5 rounded"
                style={{
                  color: (rarityColors as Record<string, string>)[rar],
                  background: `${
                    (rarityColors as Record<string, string>)[rar]
                  }22`,
                }}
              >
                {count}x {rar[0] + rar.slice(1).toLowerCase()}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
};

export default UserCard;
