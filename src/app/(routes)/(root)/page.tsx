import React from 'react';
import { getChestImage } from '@/utils/getChestImage';
import Image from 'next/image';
import coinIcon from '@/assets/images/icons/coin.png';
import { ChestType } from '@/generated/prisma';
import { getBundleImage } from '@/utils/getBundleImage';
import prisma from '../../../../prisma/prisma';
import { ChestDropRatesResponse } from '../../../../libs/api/chests';
import { getBaseUrl } from '@/utils/getBaseUrl';
import GlowingButton from '@/components/ui/common/GlowingButton';
import Link from 'next/link';
import FloatingParticles from '@/components/ui/common/FloatingParticles';
import BuyBundleBtn from './_components/BuyBundleBtn';

async function getChestTypes() {
  try {
    const chestTypes = await prisma.chestType.findMany({
      orderBy: {
        price: 'asc',
      },
    });
    return chestTypes;
  } catch (error) {
    console.error('Error fetching chest types:', error);
    return [];
  }
}

async function getBundleTypes() {
  try {
    // Include chestTypes for each bundle type
    const bundleTypes = await prisma.bundleType.findMany({
      include: {
        BundleTypeChestType: {
          include: {
            ChestType: true,
          },
        },
      },
      orderBy: {
        price: 'asc',
      },
    });
    return bundleTypes;
  } catch (error) {
    console.error('Error fetching bundle types:', error);
    return [];
  }
}

const page = async () => {
  const chestTypes = await getChestTypes();
  const bundleTypes = await getBundleTypes();
  const baseUrl = await getBaseUrl();

  // Fetch drop rates from API using fetch (server-side)
  const res = await fetch(`${baseUrl || ''}/api/chests/drop-rates`, {
    cache: 'no-store',
  });
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
                <FloatingParticles numParticles={80} />
                <div className="relative z-10 bg-[#191838] border border-[#11142d] rounded-xl overflow-hidden transform transition-transform duration-300 group-hover:scale-105 group-hover:shadow-[0_0_20px_#008cff]">
                  <div className="relative h-48 w-full">
                    {' '}
                    <Image
                      src={getChestImage(chest.name)}
                      alt={chest.name}
                      fill
                      priority
                      sizes="(max-width: 640px) 90vw, (max-width: 768px) 45vw, (max-width: 1024px) 30vw, 25vw"
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
                      </p>{' '}
                      <Image
                        src={coinIcon}
                        alt="Coins"
                        width={24}
                        height={24}
                        sizes="24px"
                        className="object-contain"
                      />
                    </div>
                    <div className="mt-4">
                      <Link href={`/chest/${chest.name}`}>
                        <GlowingButton className="w-full">
                          View Case
                        </GlowingButton>
                      </Link>
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
      {/* Bundles Section */}
      <h2 className="text-2xl font-bold mb-6 mt-12 text-neutral-100">
        Bundles
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-12">
        {bundleTypes.map((bundle) => (
          <div key={bundle.id} className="flex flex-col items-stretch">
            <div className="group relative flex flex-col">
              <FloatingParticles numParticles={80} />
              <div className="relative z-10 py-4 bg-[#191838] border border-[#11142d] rounded-xl overflow-hidden transform transition-transform duration-300 group-hover:scale-105 group-hover:shadow-[0_0_20px_#008cff]">
                <div className="relative h-48 w-full flex items-center justify-center">
                  {' '}
                  <Image
                    src={getBundleImage(bundle.name)}
                    alt={bundle.name}
                    className="object-contain h-32 w-auto mx-auto"
                    fill
                    sizes="(max-width: 640px) 90vw, (max-width: 768px) 45vw, (max-width: 1024px) 30vw, 25vw"
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-xl font-semibold text-neutral-100 mb-2">
                    {bundle.name}
                  </h3>
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-emerald-500 font-medium text-lg">
                      ${bundle.price}
                    </span>
                  </div>
                  <BuyBundleBtn bundleId={bundle.id} />
                </div>
              </div>
            </div>
            {/* Bundle contents row */}
            <div className="flex flex-row flex-wrap justify-start gap-2 mt-2 px-2 rounded-lg bg-[#18173a] border border-[#23224a] shadow-inner py-2">
              {bundle.BundleTypeChestType.map((bundleTypeChestType) => (
                <div
                  key={bundleTypeChestType.id}
                  className="flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded bg-[#23224a] text-[#008cff] transition-all duration-200 hover:scale-105 hover:bg-[#23224a]/80 hover:text-sky-300 hover:shadow-[0_0_8px_#00e0ff55]"
                >
                  <span>{bundleTypeChestType.amount}x</span>
                  <span>
                    {bundleTypeChestType.ChestType.name}{' '}
                    {bundleTypeChestType.amount > 1 ? 'Chests' : 'Chest'}
                  </span>
                  <div className="flex items-center gap-1.5">
                    {' '}
                    <Image
                      src={getChestImage(bundleTypeChestType.ChestType.name)}
                      alt="Coins"
                      width={20}
                      height={20}
                      sizes="20px"
                      className="object-contain"
                    />
                  </div>
                </div>
              ))}
              <div className="flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded bg-[#23224a] text-amber-400 transition-all duration-200 hover:scale-105 hover:bg-[#23224a]/80 hover:text-yellow-300 hover:shadow-[0_0_8px_#ffd70055]">
                <span>{bundle.coinAmount}</span>
                <div className="flex items-center gap-1.5">
                  {' '}
                  <Image
                    src={coinIcon}
                    alt="Coins"
                    width={20}
                    height={20}
                    sizes="20px"
                    className="object-contain"
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
        {/* End bundles map */}
      </div>
    </div>
  );
};

export default page;
