import LogoutBtn from '@/components/LogoutBtn';
import React from 'react';
import { getChestImage } from '@/utils/getChestImage';
import Image from 'next/image';
import { GlowingButton } from '@/components/ui/common';
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

  console.log(chestTypes);

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8 text-neutral-100">
        Regular Cases
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {chestTypes.map((chest) => (
          <div key={chest.id} className="group relative">
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
                <p className="text-emerald-500 font-medium text-lg">
                  {chest.price} Coins
                </p>
                <div className="mt-4">
                  <GlowingButton className="w-full">Open Case</GlowingButton>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-8">
        <LogoutBtn />
      </div>
    </div>
  );
};

export default page;
