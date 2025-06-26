"use client";
import Image from "next/image";

interface AchievementGridProps {
  imgs: string[];
}

const AchievementGrid: React.FC<AchievementGridProps> = ({ imgs }) => {
  return (
    <div className="grid grid-cols-4 gap-2 mt-4">
      {imgs.map((src) => (
        <div key={src} className="w-15 aspect-square relative rounded-md group mt-4 mb-4">
          <Image src={src} alt="achievement" fill className="object-contain" />
          <span className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 whitespace-nowrap text-[10px] bg-[#1c1b35] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity text-neutral-100">
            Achievement message goes here
          </span>
        </div>
      ))}
    </div>
  );
};

export default AchievementGrid;
