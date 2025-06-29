'use client';
import Image from 'next/image';
import { useMutation } from '@tanstack/react-query';
import { UploadCloud } from 'lucide-react';
import { CldUploadWidget } from 'next-cloudinary';
import LevelBar from './LevelBar';
import AchievementGrid from './AchievementGrid';
import getLevel, { MAX_LEVEL } from '@/../libs/getLevel';
import StarsButton from '@/components/ui/StarsButton';
import { categoryColors, rarityColors } from '@/utils/colors';
import { RoomCategory, Rarity, Achievement } from '@/generated/prisma';
import { updateProfileImage } from '../../../../../libs/api/user';
import { useRouter } from 'next/navigation';

interface ProfileSidebarProps {
  username: string;
  imageUrl: string;
  xp: number;
  achievements: Achievement[];
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
  const isMax = levelNum >= MAX_LEVEL;
  const nextLevelXp = isMax ? xp : (levelNum + 1) * 100;

  const router = useRouter();

  const updateMutation = useMutation({
    mutationFn: updateProfileImage,
    onSuccess: () => {
      router.refresh();
    },
  });

  return (
    <aside className="w-full bg-[#191838] border border-[#11142d] rounded-xl p-4 flex flex-col items-center h-max">
      <CldUploadWidget
        uploadPreset="profile_images"
        signatureEndpoint="/api/cloudinary-sign"
        config={{
          cloud: {
            apiKey: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
            cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
          },
        }}
        options={{
          sources: ['local', 'camera'],
          multiple: false,
          maxFiles: 1,
          cropping: true,
          folder: 'profile',
          // Apply the dark theme used across the app
          styles: {
            palette: {
              window: '#191838', // widget background
              windowBorder: '#b0b0b0',
              tabIcon: '#008cff', // primary accent (same as avatar ring)
              menuIcons: '#d1d1d1',
              textDark: '#ffffff',
              textLight: '#b0b0b0',
              link: '#008cff',
              action: '#f59e0b', // gold action color (same as StarsButton)
              inactiveTabIcon: '#4b5563',
              error: '#ef4444',
              inProgress: '#f59e0b',
              complete: '#10b981',
              sourceBg: '#11142d',
            },
            fonts: {
              default: null,
              "'Poppins', sans-serif":
                'https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap',
            },
          },
        }}
        onSuccess={(result) => {
          if (result?.event === 'success' && result.info) {
            const successResult = result as { info: { secure_url: string } };
            const secureUrl = successResult.info.secure_url as string;
            updateMutation.mutate(secureUrl);
          }
        }}
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
      </CldUploadWidget>
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
      {!isLoggedUser && (
        <StarsButton className="w-full mt-4">Invite To Trade</StarsButton>
      )}
    </aside>
  );
};

export default ProfileSidebar;
