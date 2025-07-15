import { $Enums } from '@/generated/prisma';
import FloatingParticles from '@/components/ui/common/FloatingParticles';
import Image from 'next/image';
import React, { useEffect } from 'react';

export const OPENING_TIME_MS = 3000;

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
    chestOpeningGifUrl: string;
    chestOpenedImageUrl: string;
    chestImageUrl: string;
  };
  isOpening: boolean;
  setChestIsOpening: (isOpening: boolean) => void;
  chestIsOpen: boolean;
  setChestIsOpen: (isOpening: boolean) => void;
}

const Chest = ({
  isOpening,
  chest,
  setChestIsOpening,
  setChestIsOpen,
  chestIsOpen,
}: Props) => {
  useEffect(() => {
    if (isOpening) {
      setTimeout(() => {
        setChestIsOpen(true);
        setTimeout(() => {
          setChestIsOpening(false);
        }, 100);
      }, OPENING_TIME_MS);
    }
  }, [isOpening, setChestIsOpen, setChestIsOpening]);

  return (
    <div className="rounded-xl overflow-hidden">
      <div className="relative h-[300px] w-full sm:w-[400px] flex items-center justify-center">
        <FloatingParticles numParticles={70} spread={30} />

        <div className="relative w-[250px] h-[250px] transform transition-transform hover:scale-105 duration-300">
          {isOpening ? (
            <Image
              src={chest.chestOpeningGifUrl}
              alt={chest.name}
              fill
              sizes="350px"
              quality={100}
              className="object-contain drop-shadow-[0_0_15px_rgba(0,0,0,0.5)]"
              priority
            />
          ) : chestIsOpen ? (
            <Image
              src={chest.chestOpenedImageUrl}
              alt={chest.name}
              fill
              sizes="350px"
              quality={100}
              className="object-contain drop-shadow-[0_0_15px_rgba(0,0,0,0.5)]"
              priority
            />
          ) : (
            <Image
              src={chest.chestImageUrl}
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
