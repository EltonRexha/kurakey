import { RoomCategory } from '@/generated/prisma';
import Image from 'next/image';

interface CardProps {
  title: string;
  image: string;
  price?: string;
  category?: string;
  rarity?: string;
}

const rarityColors: Record<string, string> = {
  COMMON: '#b0b0b0',
  UNCOMMON: '#4ade80',
  RARE: '#60a5fa',
  EPIC: '#a78bfa',
  LEGENDARY: '#fbbf24',
  SECRET: '#f472b6',
};

const categoryColors: Record<RoomCategory, string> = {
  ZEN: '#f472b6',
  ASCENSION: '#fbbf24',
  COSMIC: '#60a5fa',
  INFERNO: '#ef4444',
  MYSTIC: '#a78bfa',
  NEON: '#00e0ff',
  RAIN: '#38bdf8',
  SANCTUM: '#facc15',
  SECRET: '#eab308',
  URBAN: '#a3a3a3',
  VOID: '#64748b',
};

const Card = ({ title, image, price, category, rarity }: CardProps) => {
  return (
    <div className="min-w-[250px] bg-neutral-900 rounded-lg overflow-hidden snap-center hover:scale-[1.02] transition-transform duration-200 cursor-pointer">
      <div className="relative h-[150px] w-full">
        <Image
          src={image}
          alt={title}
          className="w-full h-full object-cover"
          fill
        />
      </div>
      <div className="p-2">
        <h3 className="text-white font-medium text-lg mb-1">{title}</h3>
        {category && (
          <span
            className="inline-block text-xs font-semibold px-2 py-1 rounded mr-2 mb-1 transition-all duration-200 cursor-pointer hover:scale-105 hover:bg-opacity-80 hover:shadow-[0_0_8px_#00e0ff55]"
            style={{
              color:
                (categoryColors[category as RoomCategory] as string) ||
                '#00e0ff',
              background:
                (categoryColors[category as RoomCategory] || '#00e0ff') + '22',
            }}
          >
            {category.charAt(0) + category.slice(1).toLowerCase()}
          </span>
        )}
        {rarity && (
          <span
            className="inline-block text-xs font-semibold px-2 py-1 rounded mr-2 mb-1 transition-all duration-200 cursor-pointer hover:scale-105 hover:bg-opacity-80 hover:shadow-[0_0_8px_#00e0ff55]"
            style={{
              color: rarityColors[rarity],
              background: `${rarityColors[rarity]}22`,
            }}
          >
            {rarity.charAt(0) + rarity.slice(1).toLowerCase()}
          </span>
        )}
        {price && <p className="text-emerald-500 mt-2">{price}</p>}
      </div>
    </div>
  );
};

export default Card;
