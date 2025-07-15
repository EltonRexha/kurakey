'use client';
import { Achievement } from '@/generated/prisma';
import Image from 'next/image';

interface AchievementGridProps {
  achievements: Achievement[];
}

const AchievementGrid: React.FC<AchievementGridProps> = ({ achievements }) => {
  return (
    <div className="flex flex-wrap justify-center space-x-2 mt-4">
      {achievements.map(({ imageUrl, id, unlockMessage }) => (
        <div key={id} className="w-15 aspect-square relative rounded-md group">
          <Image
            src={imageUrl}
            alt="achievement"
            fill
            className="object-contain"
          />
          <span className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 whitespace-nowrap text-[10px] bg-[#1c1b35] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity text-neutral-100">
            {unlockMessage}
          </span>
        </div>
      ))}
    </div>
  );
};

export default AchievementGrid;
