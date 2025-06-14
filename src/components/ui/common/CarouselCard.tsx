import { RoomCategory } from '@/generated/prisma';
import Image from 'next/image';
import Link from 'next/link';

interface CardProps {
  title: string;
  image: string;
  price?: string;
  category?: string;
  rarity?: string;
  id: string;
}

import { rarityColors, categoryColors } from '@/utils/colors';

const Card = ({ title, image, price, category, rarity, id }: CardProps) => {
  return (
    <Link href={`/room?id=${id}`}>
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
                  (categoryColors[category as RoomCategory] || '#00e0ff') +
                  '22',
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
    </Link>
  );
};

export default Card;
