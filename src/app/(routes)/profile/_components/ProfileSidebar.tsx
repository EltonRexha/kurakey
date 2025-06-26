"use client";
import Image from "next/image";
import LevelBar from "./LevelBar";
import AchievementGrid from "./AchievementGrid";
import getLevel from "@/../libs/getLevel";
import StarsButton from "@/components/ui/StarsButton";

interface ProfileSidebarProps {
  username: string;
  imageUrl: string;
  xp: number;
  achievements: string[]; // image paths
  joined: string;
  isLoggedUser: boolean;
}

const ProfileSidebar: React.FC<ProfileSidebarProps> = ({
  username,
  imageUrl,
  xp,
  achievements,
  joined,
  isLoggedUser,
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
