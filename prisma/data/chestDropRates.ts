import { Rarity } from '@/generated/prisma';

const chestDropRates: Record<string, { rarity: Rarity; chance: number }[]> = {
  Starter: [
    { rarity: 'COMMON', chance: 70 },
    { rarity: 'UNCOMMON', chance: 20 },
    { rarity: 'RARE', chance: 8.5 },
    { rarity: 'EPIC', chance: 1.4 },
    { rarity: 'LEGENDARY', chance: 0.1 },
    { rarity: 'SECRET', chance: 0.05 },
  ],
  Advanced: [
    { rarity: 'COMMON', chance: 55 },
    { rarity: 'UNCOMMON', chance: 25 },
    { rarity: 'RARE', chance: 12 },
    { rarity: 'EPIC', chance: 7.5 },
    { rarity: 'LEGENDARY', chance: 0.5 },
    { rarity: 'SECRET', chance: 0.1 },
  ],
  Elite: [
    { rarity: 'COMMON', chance: 40 },
    { rarity: 'UNCOMMON', chance: 30 },
    { rarity: 'RARE', chance: 20 },
    { rarity: 'EPIC', chance: 8.9 },
    { rarity: 'LEGENDARY', chance: 1.1 },
    { rarity: 'SECRET', chance: 0.25 },
  ],
  Mythic: [
    { rarity: 'COMMON', chance: 10 },
    { rarity: 'UNCOMMON', chance: 20 },
    { rarity: 'RARE', chance: 30 },
    { rarity: 'EPIC', chance: 30 },
    { rarity: 'LEGENDARY', chance: 10 },
    { rarity: 'SECRET', chance: 1 },
  ],
};

export default chestDropRates;