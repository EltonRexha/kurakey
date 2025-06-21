import { $Enums } from '@/generated/prisma';
import { getChestAnimation } from '@/utils/getChestAnimation';
import { getChestImage } from '@/utils/getChestImage';
import Image from 'next/image';
import React, { useEffect } from 'react';

const OPENING_TIME_MS = 3000;

interface Props {
  chest: {
    id: string;
    name: string;
    price: number;
    rarity: $Enums.Rarity;
    dropRates: {
      rarity: $Enums.Rarity;
      chance: number;
    }[];
    owned: number;
  };
  isOpening: boolean;
  setChestIsOpening: (isOpening: boolean) => void;
}

const Chest = ({ isOpening, chest, setChestIsOpening }: Props) => {
  useEffect(() => {
    if (isOpening) {
      setTimeout(() => {
        setChestIsOpening(false);
      }, OPENING_TIME_MS);
    }
  });
  
  return (
    <div className="rounded-xl overflow-hidden">
      <div className="relative h-[300px] w-full sm:w-[400px] flex items-center justify-center">
        <div className="relative w-[250px] h-[250px] transform transition-transform hover:scale-105 duration-300">
          {isOpening ? (
            <Image
              src={getChestAnimation(chest.name)}
              alt={chest.name}
              fill
              sizes="350px"
              quality={100}
              className="object-contain drop-shadow-[0_0_15px_rgba(0,0,0,0.5)]"
              priority
            />
          ) : (
            <Image
              src={getChestImage(chest.name)}
              alt={chest.name}
              fill
              sizes="350px"
              quality={100}
              className="object-contain drop-shadow-[0_0_15px_rgba(0,0,0,0.5)]"
              priority
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Chest;
