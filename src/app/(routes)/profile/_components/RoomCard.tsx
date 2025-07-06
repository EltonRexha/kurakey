"use client";
import Image from "next/image";
import { rarityColors, categoryColors } from "@/utils/colors";
import { RoomCategory } from "@/generated/prisma";

interface RoomCardProps {
  name: string;
  image: string;
  rarity: string;
  category: RoomCategory;
  count: number;
}

const RoomCard: React.FC<RoomCardProps> = ({ name, image, rarity, category, count }) => {
  return (
    <div className="relative w-full h-full bg-[#0d1024] border border-[#11142d] rounded-md overflow-hidden group">
      <Image src={image} alt={name} fill className="object-cover group-hover:scale-105 transition-transform duration-200" />
      {count > 1 && (
        <span className="absolute top-1 right-1 bg-[#008cff] text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
          x{count}
        </span>
      )}
      <div className="absolute inset-0 flex flex-col justify-end p-1">
        <div className="flex gap-1 mb-1">
          {[
            {
              label: rarity.charAt(0) + rarity.slice(1).toLowerCase(),
              color: rarityColors[rarity],
            },
            {
              label: category.charAt(0) + category.slice(1).toLowerCase(),
              color: categoryColors[category],
            },
          ].map(({ label, color }) => (
            <span
              key={label}
              className="text-[10px] font-semibold px-1 rounded text-white shadow-sm"
              style={{ background: `${color}95` }}
            >
              {label}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RoomCard;
