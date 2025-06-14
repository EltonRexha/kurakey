import React from 'react';
import Image from 'next/image';
import Room3D from '@/components/ui/3DRoom';
import { getChestImage } from '@/utils/getChestImage';
import Link from 'next/link';
import { Icon } from '@iconify/react';
import { notFound } from 'next/navigation';
import prisma from '../../../../prisma/prisma';
import { Rarity, RoomCategory } from '@/generated/prisma';

interface Room {
  id: string;
  name: string;
  category: RoomCategory;
  rarity: Rarity;
  isSecret: boolean;
  previewImageUrl: string;
  assetUrl: string;
}

interface ChestOdds {
  name: string;
  chance: number;
  rarity: Rarity;
}

// Server functions to fetch data
async function getRoom(id?: string): Promise<Room | null> {
  if (!id) return null;

  const room = await prisma.room.findUnique({
    where: { id },
  });

  return room as Room;
}

async function getSimilarRooms(
  category: RoomCategory,
  currentRoomId: string
): Promise<Room[]> {
  const rooms = await prisma.room.findMany({
    where: {
      category,
      id: { not: currentRoomId },
    },
  });

  return rooms as Room[];
}

async function calculateRoomOdds(room: Room): Promise<ChestOdds[]> {
  const chests = await prisma.chestType.findMany({
    where: {
      ChestDropRate: {
        some: {
          rarity: room.rarity,
        },
      },
    },
    include: {
      ChestDropRate: true,
    },
  });

  const rarityRoomAmount = (
    await prisma.room.findMany({
      where: {
        rarity: room.rarity,
      },
    })
  ).length;

  return chests.map((chest) => {
    const dropRate = chest.ChestDropRate.find((dropRate) => {
      return dropRate.rarity === room.rarity;
    })!;

    return {
      name: chest.name,
      rarity: dropRate.rarity,
      chance: dropRate.chance * (1 / rarityRoomAmount),
    };
  });
}

import { rarityColors, categoryColors } from '@/utils/colors';

interface PageProps {
  searchParams: Promise<{ id?: string }>;
}

const page = async ({ searchParams }: PageProps) => {
  // Fetch room data
  const params = await searchParams;
  const room = await getRoom(params.id);
  if (!room) notFound();

  const chestOdds = await calculateRoomOdds(room);

  // Fetch similar rooms
  const similarRooms = await getSimilarRooms(room.category, room.id);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Left side - 3D Room Viewer */}
        <div className="flex flex-col gap-4">
          <div className="bg-[#191838] border border-[#11142d] rounded-xl overflow-hidden h-[500px]">
            <Room3D playcanvasLink={room.assetUrl} />
          </div>

          {/* Controls Guide */}
          <div className="bg-[#191838] border border-[#11142d] rounded-xl p-4">
            <h3 className="text-lg font-semibold text-neutral-100 mb-3">
              Room Controls
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="flex items-center gap-3 bg-[#18173a]/50 px-4 py-3 rounded-lg border border-[#23224a] transition-all duration-300 hover:shadow-[0_0_15px_#008cff33] group">
                <div className="text-sky-400">
                  <Icon icon="mdi:mouse-left-click" className="w-6 h-6" />
                </div>
                <span className="text-neutral-300 group-hover:text-white transition-colors">
                  Hold and drag to look around
                </span>
              </div>
              <div className="flex items-center gap-3 bg-[#18173a]/50 px-4 py-3 rounded-lg border border-[#23224a] transition-all duration-300 hover:shadow-[0_0_15px_#008cff33] group">
                <div className="text-sky-400">
                  <Icon icon="mdi:mouse-right-click" className="w-6 h-6" />
                </div>
                <span className="text-neutral-300 group-hover:text-white transition-colors">
                  Hold and drag to pan
                </span>
              </div>
              <div className="flex items-center gap-3 bg-[#18173a]/50 px-4 py-3 rounded-lg border border-[#23224a] transition-all duration-300 hover:shadow-[0_0_15px_#008cff33] group">
                <div className="text-sky-400">
                  <Icon icon="mdi:mouse" className="w-6 h-6" />
                </div>
                <span className="text-neutral-300 group-hover:text-white transition-colors">
                  Scroll to zoom in/out
                </span>
              </div>
            </div>
          </div>
        </div>
        {/* Right side - Room Info and Odds */}
        <div className="space-y-6">
          <div className="bg-[#191838] border border-[#11142d] rounded-xl p-6">
            <h1 className="text-3xl font-bold text-neutral-100 mb-4">
              {room.name}
            </h1>
            <div className="flex flex-wrap gap-6 text-neutral-400 mb-6">
              <div className="flex items-center bg-[#18173a]/50 px-4 py-2 rounded-lg border border-[#23224a] transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_15px_#008cff33] group">
                <p className="mr-2">Category:</p>{' '}
                <span
                  className="px-3 py-1 rounded-md font-medium transition-all duration-300"
                  style={{
                    color: categoryColors[room.category],
                    backgroundColor: `${categoryColors[room.category]}22`,
                  }}
                >
                  {room.category.charAt(0) +
                    room.category.slice(1).toLowerCase()}
                </span>
              </div>
              <div className="flex items-center bg-[#18173a]/50 px-4 py-2 rounded-lg border border-[#23224a] transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_15px_#fbbf2433] group">
                <p className="mr-2">Rarity:</p>
                <span
                  className="px-3 py-1 rounded-md font-medium transition-all duration-300"
                  style={{
                    color: rarityColors[room.rarity],
                    backgroundColor: `${rarityColors[room.rarity]}15`,
                  }}
                >
                  <span className="group-hover:animate-pulse">
                    {room.rarity}
                  </span>
                </span>
              </div>
            </div>
            {/* Odds Display */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-neutral-100">
                Possible Rewards
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {chestOdds.map((chest: ChestOdds, index: number) => (
                  <div
                    key={index}
                    className="group flex items-center gap-4 bg-[#18173a] border border-[#23224a] rounded-lg p-4 transform transition-all duration-300 hover:scale-[1.02]"
                    style={
                      {
                        '--hover-color': rarityColors[chest.rarity] + '33',
                      } as React.CSSProperties
                    }
                  >
                    <div className="relative w-16 h-16 transition-transform duration-300 group-hover:scale-110">
                      <div
                        className="absolute inset-0 rounded-full transition-opacity duration-300 opacity-0 group-hover:opacity-100"
                        style={{
                          background: `radial-gradient(circle, ${
                            rarityColors[chest.rarity]
                          }22 0%, transparent 70%)`,
                        }}
                      />{' '}
                      <Image
                        src={getChestImage(chest.name)}
                        alt={chest.name}
                        fill
                        sizes="64px"
                        className="object-contain p-1 drop-shadow-[0_0_2px_rgba(0,0,0,0.5)] transition-all duration-300 group-hover:drop-shadow-[0_0_4px_rgba(0,0,0,0.7)]"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-neutral-100 font-medium transition-colors duration-300 group-hover:text-white">
                        {chest.name}
                      </h3>
                      <div
                        className="text-sm font-semibold mt-1 transition-all duration-300 group-hover:translate-x-1"
                        style={{
                          color: rarityColors[chest.rarity],
                          textShadow: `0 0 10px ${
                            rarityColors[chest.rarity]
                          }33`,
                        }}
                      >
                        {chest.chance}% Chance
                      </div>
                    </div>
                    <div
                      className="absolute inset-0 rounded-lg transition-opacity duration-300 opacity-0 group-hover:opacity-100 pointer-events-none"
                      style={{
                        background: `linear-gradient(45deg, var(--hover-color) 0%, transparent 100%)`,
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Similar Rooms Section - Only show if there are similar rooms */}
      {similarRooms.length > 0 && (
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6 text-neutral-100">
            More {room.category} Rooms
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {similarRooms.map((similarRoom: Room) => (
              <Link href={`/room?id=${similarRoom.id}`} key={similarRoom.id}>
                <div className="group relative flex flex-col">
                  <div className="bg-[#191838] border border-[#11142d] rounded-xl overflow-hidden transform transition-transform duration-300 group-hover:scale-105 group-hover:shadow-[0_0_20px_#008cff]">
                    <div className="relative h-48 w-full">
                      {' '}
                      <Image
                        src={similarRoom.previewImageUrl}
                        alt={similarRoom.name}
                        fill
                        sizes="(max-width: 640px) 90vw, (max-width: 768px) 45vw, (max-width: 1024px) 30vw, 25vw"
                        className="object-cover"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="text-xl font-semibold text-neutral-100 mb-2">
                        {similarRoom.name}
                      </h3>{' '}
                      <p
                        className="text-sm"
                        style={{ color: categoryColors[similarRoom.category] }}
                      >
                        {similarRoom.category.charAt(0) +
                          similarRoom.category.slice(1).toLowerCase()}
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default page;
