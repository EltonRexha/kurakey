import { PrismaClient } from '../src/generated/prisma';

const prisma = new PrismaClient();

async function main() {
  const chestTypes = [
    {
      name: 'Starter',
      price: 100,
    },
    {
      name: 'Advanced',
      price: 250,
    },
    {
      name: 'Elite',
      price: 500,
    },
    {
      name: 'Mythic',
      price: 1500,
    },
  ];

  console.log('🌱 Starting to seed chest types and drop rates...');

  // Chest odds data from screenshot
  const chestDropRates = {
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

  for (const chestType of chestTypes) {
    const createdChestType = await prisma.chestType.upsert({
      where: { name: chestType.name },
      update: {},
      create: chestType,
    });

    // Seed drop rates for each chest type
    const dropRates = chestDropRates[chestType.name];
    for (const drop of dropRates) {
      await prisma.chestDropRate.upsert({
        where: {
          chestTypeId_rarity: {
            chestTypeId: createdChestType.id,
            rarity: drop.rarity,
          },
        },
        update: { chance: drop.chance },
        create: {
          chestTypeId: createdChestType.id,
          rarity: drop.rarity,
          chance: drop.chance,
        },
      });
    }
  }

  console.log('✅ Chest types and drop rates seeded successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding chest types:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
