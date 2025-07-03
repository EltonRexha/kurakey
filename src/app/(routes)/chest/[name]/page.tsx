import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { rarityColors } from '@/utils/colors';
import { Room, ChestType, ChestDropRate } from '@/generated/prisma';
import prisma from '../../../../../prisma/prisma';
import GetServerUser from '../../../../../libs/GetServerUser';
import ChestContainer from './_components/ChestContainer';

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
      opened: false,
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
      <ChestContainer chest={chest} userCoinBalance={user?.coinBalance} />

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
                          {Math.round(room.odds * 10) / 10 === 0
                            ? '<0% Chance'
                            : `${Math.round(room.odds * 10) / 10}% Chance`}
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
