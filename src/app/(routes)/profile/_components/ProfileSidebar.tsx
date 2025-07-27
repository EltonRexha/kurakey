'use client';
import Image from 'next/image';
import { useMutation } from '@tanstack/react-query';
import { UploadCloud } from 'lucide-react';
import LevelBar from './LevelBar';
import AchievementGrid from './AchievementGrid';
import getLevel, { MAX_LEVEL, MIN_LEVEL_TRADE } from '@/../libs/getLevel';
import StarsButton from '@/components/ui/StarsButton';
import { categoryColors, rarityColors } from '@/utils/colors';
import { RoomCategory, Rarity, Achievement } from '@/generated/prisma';
import { updateProfileImage } from '../../../../../libs/api/user';
import { useRouter } from 'next/navigation';
import TradeBtn from './TradeBtn';
import { useToastContext } from '@/context/ToastContext';
import CustomUploadWidget from '@/components/ui/CustomUploadWidget';

interface ProfileSidebarProps {
  username: string;
  imageUrl: string;
  xp: number;
  achievements: Achievement[];
  joined: string;
  isLoggedUser: boolean;
  categories: RoomCategory[];
  rarities: Rarity[];
  profileId: string;
  currentUserXp?: number;
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
  profileId,
  currentUserXp,
}) => {
  const levelNum = Number(getLevel(xp));
  const isMax = levelNum >= MAX_LEVEL;
  const nextLevelXp = isMax ? xp : (levelNum + 1) * 100;

  const router = useRouter();

  const updateMutation = useMutation({
    mutationFn: updateProfileImage,
    onSuccess: () => {
      router.refresh();
    },
  });

  const { addToast } = useToastContext();

  const handleUploadSuccess = (imageUrl: string) => {
    updateMutation.mutate(imageUrl);
  };

  const handleUploadError = (message: string) => {
    addToast(message, 'error');
  };

  return (
    <aside className="w-full bg-[#191838] border border-[#11142d] rounded-xl p-4 flex flex-col items-center h-max">
      <CustomUploadWidget
        onSuccess={handleUploadSuccess}
        onError={handleUploadError}
        disabled={!isLoggedUser}
      >
        {({ open }) => (
          <div className="relative">
            <div
              className={`w-24 h-24 rounded-full overflow-hidden ring-4 ring-[#008cff]/50 mb-3 ${
                isLoggedUser ? 'group cursor-pointer' : ''
              }`}
              onClick={() => {
                if (isLoggedUser) {
                  open();
                }
              }}
            >
              <Image
                src={imageUrl}
                alt="avatar"
                width={96}
                height={96}
                className="object-cover"
              />
              {isLoggedUser && (
                <span className="absolute z-50 top-1 right-1 bg-[#11142d]/80 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <UploadCloud size={16} className="text-white" />
                </span>
              )}
            </div>
          </div>
        )}
      </CustomUploadWidget>
      <h2 className="text-lg font-bold text-neutral-100 mb-3">{username}</h2>
      <LevelBar
        level={levelNum}
        xp={xp}
        nextLevelXp={nextLevelXp}
        isMax={isMax}
      />
      <AchievementGrid achievements={achievements} />
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
      {!isLoggedUser &&
        currentUserXp !== undefined &&
        (getLevel(currentUserXp) >= MIN_LEVEL_TRADE ? (
          <TradeBtn receiverId={profileId} />
        ) : (
          <StarsButton className="w-full mt-4" disabled>
            Must reach level {MIN_LEVEL_TRADE} to trade
          </StarsButton>
        ))}
    </aside>
  );
};

export default ProfileSidebar;
