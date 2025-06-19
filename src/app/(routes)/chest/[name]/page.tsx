import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getChestImage } from '@/utils/getChestImage';
import { rarityColors } from '@/utils/colors';
import coinIcon from '@/assets/images/icons/coin.png';
import GlowingButton from '@/components/ui/common/GlowingButton';
import { Room, ChestType, ChestDropRate } from '@/generated/prisma';
import prisma from '../../../../../prisma/prisma';
import GetServerUser from '../../../../../libs/GetServerUser';
import BuyChestBtn from '@/components/BuyChestBtn';

// Server functions
async function getChestTypeByName(
  name: string
): Promise<(ChestType & { ChestDropRate: ChestDropRate[] }) | null> {
  return prisma.chestType.findFirst({
    where: {
      name: {
        equals: name,
        mode: 'insensitive',
      },
    },
    include: { ChestDropRate: true },
  });
}

async function getAllRooms(): Promise<Room[]> {
  return prisma.room.findMany();
}

function calculateRoomOddsForChest(
  rooms: Room[],
  chestType: ChestType & { ChestDropRate: ChestDropRate[] }
): (Room & { odds: number })[] {
  return rooms
    .filter((room: Room) =>
      chestType.ChestDropRate.some(
        (rate: ChestDropRate) => rate.rarity === room.rarity
      )
    )
    .map((room: Room) => {
      const dropRate = chestType.ChestDropRate.find(
        (rate: ChestDropRate) => rate.rarity === room.rarity
      );
      const roomsOfThisRarity = rooms.filter(
        (r: Room) => r.rarity === room.rarity
      ).length;
      const odds = dropRate ? dropRate.chance / roomsOfThisRarity : 0;
      return { ...room, odds };
    });
}

async function getOwnedAmount(chestType: string, userId: string) {
  const chests = await prisma.chest.findMany({
    where: {
      type: {
        name: {
          equals: chestType,
          mode: 'insensitive',
        },
      },
      User: {
        id: userId,
      },
    },
  });

  return chests.length;
}

interface ChestPageProps {
  params: Promise<{ name: string }>;
}

const ChestPage = async ({ params }: ChestPageProps) => {
  const { name } = await params;
  const chestType = await getChestTypeByName(name);
  if (!chestType) notFound();
  const allRooms = await getAllRooms();
  const possibleRooms = calculateRoomOddsForChest(allRooms, chestType);
  const user = await GetServerUser();

  const ownedChests = user ? await getOwnedAmount(chestType.name, user.id) : 0;

  // Use real data from chestType
  const chest = {
    id: chestType.id,
    name: chestType.name,
    price: chestType.price,
    rarity: chestType.ChestDropRate[0]?.rarity,
    dropRates: chestType.ChestDropRate.map((rate) => ({
      rarity: rate.rarity,
      chance: rate.chance,
    })),
    owned: ownedChests,
  };

  if (!chest) notFound();

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Left side - Chest Display */}
        <div className="flex flex-col items-center justify-center">
          <div className="rounded-xl overflow-hidden">
            <div className="relative h-[300px] w-full sm:w-[400px] flex items-center justify-center">
              <div className="relative w-[250px] h-[250px] transform transition-transform hover:scale-105 duration-300">
                <Image
                  src={getChestImage(chest.name)}
                  alt={chest.name}
                  fill
                  sizes="250px"
                  className="object-contain drop-shadow-[0_0_15px_rgba(0,0,0,0.5)]"
                  priority
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Chest Info and Odds */}
        <div className="space-y-6">
          <div className="bg-[#191838] border border-[#11142d] rounded-xl p-6">
            <div className="flex justify-between items-start mb-6">
              <h1 className="text-3xl font-bold text-neutral-100">
                {chest.name}
              </h1>
              <div className="flex items-center gap-1.5 bg-[#18173a]/50 px-4 py-2 rounded-lg border border-[#23224a]">
                <span className="text-emerald-500 font-medium text-lg">
                  {chest.price}
                </span>
                <Image
                  src={coinIcon}
                  alt="Coins"
                  width={24}
                  height={24}
                  sizes="24px"
                  className="object-contain"
                />
              </div>
            </div>

            {/* Drop Rates Display */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-neutral-100">
                Drop Rates
              </h2>{' '}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {chest.dropRates.map((rate) => (
                  <div
                    key={rate.rarity}
                    className="flex flex-col items-center text-xs font-semibold px-2 py-1 rounded transition-all duration-200 hover:scale-105 hover:bg-opacity-20 hover:shadow-[0_0_8px_rgba(var(--rarity-glow-color),0.5)]"
                    style={
                      {
                        color: rarityColors[rate.rarity],
                        background: `${rarityColors[rate.rarity]}22`,
                      } as React.CSSProperties
                    }
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
              <div className="flex items-center gap-2 text-sm text-neutral-400 mt-4 pt-4 border-t border-[#23224a]">
                <span>You own:</span>
                <span className="font-bold text-neutral-300">
                  {chest.owned}
                </span>
              </div>
              <div className="mt-6 flex justify-center">
                <div className="w-[90%] flex flex-col sm:flex-row gap-2">
                  {user && (
                    <BuyChestBtn
                      price={chest.price}
                      userBalance={user.coinBalance}
                      chestId={chest.id}
                      chestName={chest.name}
                    />
                  )}
                  {chest.owned ? (
                    <GlowingButton fullWidth>Open</GlowingButton>
                  ) : (
                    <GlowingButton fullWidth disabled>
                      Open
                    </GlowingButton>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Possible Rooms Section */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-6 text-neutral-100">
          Possible Rooms
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {possibleRooms.map((room) => {
            return (
              <Link href={`/room?id=${room.id}`} key={room.id}>
                <div className="group relative flex flex-col">
                  <div className="bg-[#191838] border border-[#11142d] rounded-xl overflow-hidden transform transition-transform duration-300 group-hover:scale-105 group-hover:shadow-[0_0_20px_#008cff]">
                    <div className="relative h-48 w-full">
                      <Image
                        src={room.previewImageUrl}
                        alt={room.name}
                        fill
                        sizes="(max-width: 640px) 90vw, (max-width: 768px) 45vw, (max-width: 1024px) 30vw, 25vw"
                        className="object-cover"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="text-xl font-semibold text-neutral-100 mb-2">
                        {room.name}
                      </h3>
                      <span
                        className="inline-block text-xs font-semibold px-2 py-1 rounded transition-all duration-200 mb-2"
                        style={{
                          color: rarityColors[room.rarity],
                          backgroundColor: `${rarityColors[room.rarity]}22`,
                        }}
                      >
                        {room.rarity.charAt(0) +
                          room.rarity.slice(1).toLowerCase()}
                      </span>
                      <div className="mt-2">
                        <span
                          className="inline-block text-xs font-bold px-2 py-1 rounded"
                          style={{
                            color: rarityColors[room.rarity],
                          }}
                        >
                          {room.odds}% chance
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ChestPage;
