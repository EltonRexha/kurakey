"use client";
import Image from "next/image";
import LevelBar from "./LevelBar";
import AchievementGrid from "./AchievementGrid";
import getLevel from "@/../libs/getLevel";
import StarsButton from "@/components/ui/StarsButton";

import { categoryColors, rarityColors } from "@/utils/colors";
import { RoomCategory, Rarity } from "@/generated/prisma";

interface ProfileSidebarProps {
  username: string;
  imageUrl: string;
  xp: number;
  achievements: string[]; // image paths
  joined: string;
  isLoggedUser: boolean;
  categories: RoomCategory[];
  rarities: Rarity[];
}

const ProfileSidebar: React.FC<ProfileSidebarProps> = ({
  username,
  imageUrl,
  xp,
  achievements,
  joined,
  isLoggedUser,
  categories,
  rarities,
}) => {
  const levelNum = Number(getLevel(xp));
  const isMax = levelNum >= 10;
  const nextLevelXp = isMax ? xp : (levelNum + 1) * 100;

  return (
    <aside className="w-full bg-[#191838] border border-[#11142d] rounded-xl p-4 flex flex-col items-center h-max">
      <div className="relative w-24 h-24 rounded-full overflow-hidden ring-4 ring-[#008cff]/50 mb-3">
        <Image src={imageUrl} alt="avatar" fill className="object-cover" />
      </div>
      <h2 className="text-lg font-bold text-neutral-100 mb-3">{username}</h2>
      <LevelBar
        level={levelNum}
        xp={xp}
        nextLevelXp={nextLevelXp}
        isMax={isMax}
      />
      <AchievementGrid imgs={achievements} />
      {/* Unlocked sections */}
      {categories.length > 0 && (
        <section className="w-full mt-4">
          <p className="text-xs text-neutral-400 mb-1 text-center">
            Unlocked Categories
          </p>
          <div className="flex flex-wrap gap-1 justify-center">
            {categories.map((cat) => (
              <span
                key={cat}
                className="text-[14px] font-semibold px-1 rounded hover:shadow-[0_0_8px_#00e0ff55] cursor-default"
                style={{
                  color: categoryColors[cat],
                  background: `${categoryColors[cat]}22`,
                }}
              >
                {cat.charAt(0) + cat.slice(1).toLowerCase()}
              </span>
            ))}
          </div>
        </section>
      )}
      {rarities.length > 0 && (
        <section className="w-full mt-4">
          <p className="text-xs text-neutral-400 mb-1 text-center">
            Unlocked Rarities
          </p>
          <div className="flex flex-wrap gap-2 justify-center">
            {rarities.map((rar) => (
              <span
                key={rar}
                className="text-[14px] font-semibold px-2 rounded hover:shadow-[0_0_8px_#00e0ff55] cursor-default"
                style={{
                  color: rarityColors[rar],
                  background: `${rarityColors[rar]}22`,
                }}
              >
                {rar.charAt(0) + rar.slice(1).toLowerCase()}
              </span>
            ))}
          </div>
        </section>
      )}
      <p className="text-xs text-neutral-400 mt-4">
        Joined: {new Date(joined).toLocaleDateString()}
      </p>
      {!isLoggedUser && (
        <StarsButton className="w-full mt-4">Invite To Trade</StarsButton>
      )}
    </aside>
  );
};

export default ProfileSidebar;
