import { Rarity } from '@/generated/prisma';
import { pickRarityFromDropRates } from './pickRarityFromDropRates';
import { pickRandomRoomByRarity } from './pickRandomRoomByRarity';

export interface DropRate {
  rarity: Rarity;
  chance: number;
}

export async function pickRoomByDropRates(dropRates: DropRate[]) {
  let pickedRarity = pickRarityFromDropRates(dropRates);
  let room = await pickRandomRoomByRarity(pickedRarity);
  let attempts = 1;

  while (!room) {
    if (attempts >= 10) {
      throw new Error('Failed to pick a room after 10 attempts');
    }
    pickedRarity = pickRarityFromDropRates(dropRates);
    room = await pickRandomRoomByRarity(pickedRarity);
    attempts++;
  }

  return room;
}
