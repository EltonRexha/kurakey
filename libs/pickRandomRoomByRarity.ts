import { $Enums } from '@/generated/prisma';
import prisma from '../prisma/prisma';

/**
 * Picks a random room from the database with the given rarity.
 * @param rarity The rarity to filter rooms by
 * @returns The randomly selected room, or null if none found
 */
export async function pickRandomRoomByRarity(rarity: $Enums.Rarity) {
  // Get all rooms with the given rarity
  const rooms = await prisma.room.findMany({
    where: { rarity },
  });
  if (!rooms.length) return null;
  const idx = Math.floor(Math.random() * rooms.length);
  return rooms[idx];
}
