import React from 'react';
import { getChestImage } from '@/utils/getChestImage';
import Image from 'next/image';
import { GlowingButton } from '@/components/ui/common';
import { ChestDropRatesResponse } from '../../../../../libs/api/chests';
import coinIcon from '@/assets/images/icons/coin.png';
import { ChestType } from '@/generated/prisma';
import prisma from '../../../../../prisma/prisma';

async function getChestTypes() {
  try {
    const chestTypes = await prisma.chestType.findMany();
    return chestTypes;
  } catch (error) {
    console.error('Error fetching chest types:', error);
    return [];
  }
}

const page = async () => {
  const chestTypes = await getChestTypes();

  // Fetch drop rates from API using fetch (server-side)
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL || ''}/api/chests/drop-rates`,
    {
      cache: 'no-store',
    }
  );
  if (!res.ok) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[40vh] text-center">
        <div className="inline-block px-6 py-4 bg-[#2a2747] border border-[#ff4d4f] rounded-lg shadow-lg">
          <h2 className="text-xl font-bold text-[#ff4d4f] mb-2">
            Failed to load chest odds
          </h2>
          <p className="text-neutral-300">
            Something went wrong on our end. Please try again later.
          </p>
        </div>
      </div>
    );
  }
  const { odds: dropRatesByChest }: ChestDropRatesResponse = await res.json();

  // Rarity color map
  const rarityColors: Record<string, string> = {
    COMMON: '#b0b0b0',
    UNCOMMON: '#4ade80',
    RARE: '#60a5fa',
    EPIC: '#a78bfa',
    LEGENDARY: '#fbbf24',
    SECRET: '#f472b6',
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-neutral-100">
        Regular Cases
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {chestTypes.map((chest: ChestType) => {
          const dropRates =
            dropRatesByChest[chest.name as keyof typeof dropRatesByChest] || [];
          return (
            <div key={chest.id} className="flex flex-col items-stretch">
              <div className="group relative flex-1 flex flex-col">
                <div className="bg-[#191838] border border-[#11142d] rounded-xl overflow-hidden transform transition-transform duration-300 group-hover:scale-105 group-hover:shadow-[0_0_20px_#008cff]">
                  <div className="relative h-48 w-full">
                    <Image
                      src={getChestImage(chest.name)}
                      alt={chest.name}
                      fill
                      className="object-contain p-4"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="text-xl font-semibold text-neutral-100 mb-2">
                      {chest.name}
                    </h3>
                    <div className="flex items-center gap-1.5">
                      <p className="text-emerald-500 font-medium text-lg">
                        {chest.price}
                      </p>
                      <Image
                        src={coinIcon}
                        alt="Coins"
                        width={24}
                        height={24}
                        className="object-contain"
                      />
                    </div>
                    <div className="mt-4">
                      <GlowingButton className="w-full">
                        View Case
                      </GlowingButton>
                    </div>
                  </div>
                </div>
              </div>
              {/* Odds row */}
              <div className="flex flex-row flex-wrap justify-start gap-1 mt-2 px-2 rounded-lg bg-[#18173a] border border-[#23224a] shadow-inner py-2">
                {dropRates.map((rate) => (
                  <div
                    key={rate.rarity}
                    className="flex flex-col items-center text-xs font-semibold px-2 py-1 rounded transition-all duration-200 hover:scale-105 hover:bg-opacity-20"
                    style={{
                      color: rarityColors[rate.rarity],
                      background: `${rarityColors[rate.rarity]}22`,
                    }}
                  >
                    <span className="uppercase tracking-wide drop-shadow-sm">
                      {rate.rarity.charAt(0) +
                        rate.rarity.slice(1).toLowerCase()}
                    </span>
                    <span className="font-bold text-sm drop-shadow-glow">
                      {rate.chance}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default page;
