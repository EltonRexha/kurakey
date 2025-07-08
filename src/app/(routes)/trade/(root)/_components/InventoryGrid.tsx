'use client';

/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useState } from 'react';
import ChestCard from '@/app/(routes)/profile/_components/ChestCard';
import RoomCard from '@/app/(routes)/profile/_components/RoomCard';
import Link from 'next/link';

type Item = {
  type: 'chest';
  data: {
    name: string;
    count: number;
    id: string;
  };
} | {
  type: 'room';
  data: {
    name: string;
    image: string;
    rarity: string;
    category: string;
    count: number;
    id: string;
    roomId: string;
  };
}

interface InventoryGridProps {
  items: Item[];
}

/**
 * Responsive 3-row inventory grid (similar to Profile grids). Always displays
 * empty placeholder cards to maintain a fixed layout even when no items are
 * in the trade yet.
 */
const InventoryGrid: React.FC<InventoryGridProps> = ({ items }) => {
  const [cols, setCols] = useState(4);

  useEffect(() => {
    const calcCols = () => {
      const w = window.innerWidth;
      if (w < 500) return 2;
      if (w < 640) return 3;
      if (w < 1024) return 4;
      if (w < 1280) return 3;
      return 4;
    };
    const handleResize = () => setCols(calcCols());
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const totalSlots = cols * 3; // 3 rows
  const placeholders = Math.max(totalSlots - items.length, 0);

  return (
    <div
      className="grid gap-2 overflow-y-auto h-[320px] grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-3 xl:grid-cols-4"
    >
      {items.map((item) => (
        <div key={item.data.id} className="aspect-square w-full">
          {item.type === 'chest' ? (
            <ChestCard name={item.data.name} count={item.data.count} />
          ) : (
            <Link href={`/room?id=${item.data.roomId}`}>
              <RoomCard
                name={item.data.name}
                image={item.data.image}
                rarity={item.data.rarity}
                category={item.data.category as any}
                count={item.data.count}
              />
            </Link>
          )}
        </div>
      ))}

      {Array.from({ length: placeholders }).map((_, i) => (
        <div
          key={`ph-${i}`}
          className="aspect-square w-full border border-[#11142d] bg-[#0d1024]/50 rounded-md"
        />
      ))}
    </div>
  );
};

export default InventoryGrid;
