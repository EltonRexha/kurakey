import { Rarity } from '@/generated/prisma';

export interface DropRate {
  rarity: Rarity;
  chance: number;
}

/**
 * Picks a rarity based on an array of drop rates (chance in percent).
 * @param dropRates Array of { rarity, chance }
 * @returns The picked rarity
 */
export function pickRarityFromDropRates(dropRates: DropRate[]): Rarity {
  const totalChance = dropRates.reduce((sum, dr) => sum + dr.chance, 0);
  const rand = Math.random() * totalChance;
  let acc = 0;
  let pickedRarity = dropRates[0].rarity;
  for (const dr of dropRates) {
    acc += dr.chance;
    if (rand < acc) {
      pickedRarity = dr.rarity;
      break;
    }
  }
  return pickedRarity;
}
