import React from 'react';
import Image from 'next/image';
import { getCoinPackageImage } from '@/utils/getCoinPackageImage';
import coinIcon from '@/assets/images/icons/coin.png';
import prisma from '../../../../prisma/prisma';
import { CoinPackage } from '@/generated/prisma';
import FloatingParticles from '@/components/ui/common/FloatingParticles';

import BuyBtn from './_components/BuyBtn';

async function getCoinPackages() {
  try {
    const packages = await prisma.coinPackage.findMany({
      orderBy: { price: 'asc' },
    });
    return packages;
  } catch (error) {
    console.error('Error fetching coin packages:', error);
    return [];
  }
}

const page = async () => {
  const coinPackages = await getCoinPackages();

  return (
    <div className="max-w-7xl mx-auto px-4 pt-16 pb-17">
      <h1 className="text-3xl font-bold mb-8 text-neutral-100 text-center">
        Buy Coins
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {coinPackages.map((pkg: CoinPackage) => (
          <div key={pkg.id} className="relative">
            <div className="hidden sm:block">
              <FloatingParticles numParticles={70} spread={30} />
            </div>

            <div className="flex flex-col items-stretch w-full bg-[#191838] scale-100 border-[#11142d] py-8 px-4 border rounded-xl overflow-hidden transform transition-transform duration-300 hover:scale-105 hover:shadow-[0_0_20px_#008cff]">
              <div className="group relative flex flex-col">
                <div>
                  <div className="relative h-40 w-full flex items-center justify-center">
                    <Image
                      src={getCoinPackageImage(pkg.name)}
                      alt={pkg.name}
                      className="object-contain h-28 w-auto mx-auto"
                      fill
                      sizes="(max-width: 640px) 90vw, (max-width: 768px) 45vw, (max-width: 1024px) 30vw, 25vw"
                    />
                  </div>
                  <div className="p-4 flex flex-col gap-2">
                    <h3 className="text-xl font-semibold text-neutral-100 mb-1 text-center capitalize">
                      {pkg.name}
                    </h3>
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <span className="text-emerald-500 font-medium text-2xl">
                        ${pkg.price}
                      </span>
                    </div>
                    <hr className="my-2 border-t border-[#23224a] opacity-60" />
                    <div className="flex items-center justify-center gap-1 text-base font-semibold text-emerald-500">
                      <span>{pkg.baseCoins + pkg.bonusCoins}</span>
                      <Image
                        src={coinIcon}
                        alt="Coins"
                        width={22}
                        height={22}
                        className="object-contain"
                      />
                      {pkg.bonusCoins > 0 && (
                        <span className="ml-2 text-xs text-amber-300 bg-emerald-900/40 px-2 py-0.5 rounded-full font-bold">
                          +{pkg.bonusCoins} Bonus
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <BuyBtn coinPackageId={pkg.id} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default page;
