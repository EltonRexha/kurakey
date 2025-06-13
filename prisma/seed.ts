import { PrismaClient, Rarity, RoomCategory } from '../src/generated/prisma';

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

  // --- BundleType seeding ---
  console.log('🌱 Seeding bundle types...');

  // Fetch chest type records for connect
  const starterChest = await prisma.chestType.findUnique({
    where: { name: 'Starter' },
  });
  const advancedChest = await prisma.chestType.findUnique({
    where: { name: 'Advanced' },
  });
  const eliteChest = await prisma.chestType.findUnique({
    where: { name: 'Elite' },
  });
  const mythicChest = await prisma.chestType.findUnique({
    where: { name: 'Mythic' },
  });

  if (!starterChest || !advancedChest || !eliteChest || !mythicChest) {
    throw new Error('One or more required chest types not found.');
  }

  const bundleTypes = [
    {
      name: 'Starter Bundle',
      price: 5,
      coinAmount: 500,
      chests: [{ chestTypeId: starterChest.id, amount: 1 }],
    },
    {
      name: 'Pro Bundle',
      price: 10,
      coinAmount: 1400,
      chests: [
        { chestTypeId: starterChest.id, amount: 1 },
        { chestTypeId: advancedChest.id, amount: 1 },
      ],
    },
    {
      name: 'Elite Bundle',
      price: 20,
      coinAmount: 3200,
      chests: [
        { chestTypeId: advancedChest.id, amount: 1 },
        { chestTypeId: eliteChest.id, amount: 1 },
      ],
    },
    {
      name: 'Mythic Bundle',
      price: 50,
      coinAmount: 9000,
      chests: [
        { chestTypeId: starterChest.id, amount: 2 },
        { chestTypeId: advancedChest.id, amount: 2 },
        { chestTypeId: eliteChest.id, amount: 2 },
        { chestTypeId: mythicChest.id, amount: 1 },
      ],
    },
  ];

  for (const bundle of bundleTypes) {
    // Upsert the bundle type
    const createdBundleType = await prisma.bundleType.upsert({
      where: { name: bundle.name },
      update: {
        price: bundle.price,
        coinAmount: bundle.coinAmount,
      },
      create: {
        name: bundle.name,
        price: bundle.price,
        coinAmount: bundle.coinAmount,
      },
    });

    // Upsert the chest connections with amounts
    for (const chest of bundle.chests) {
      await prisma.bundleTypeChestType.upsert({
        where: {
          bundleTypeId_chestTypeId: {
            bundleTypeId: createdBundleType.id,
            chestTypeId: chest.chestTypeId,
          },
        },
        update: { amount: chest.amount },
        create: {
          bundleTypeId: createdBundleType.id,
          chestTypeId: chest.chestTypeId,
          amount: chest.amount,
        },
      });
    }
  }

  console.log('✅ Bundle types seeded successfully!');

  // --- Room seeding ---
  console.log('🌱 Seeding rooms...');
  const roomsData = (await import('./data/rooms')).default;
  for (const [category, roomsArr] of Object.entries(roomsData)) {
    for (const room of roomsArr) {
      await prisma.room.upsert({
        where: {
          name_category: {
            name: room.name,
            category: category as RoomCategory,
          },
        },
        update: {
          rarity: room.rarity,
          category: category as RoomCategory,
          assetUrl: room.assetUrl,
          previewImageUrl: room.imagePreviewUrl,
        },
        create: {
          name: room.name,
          rarity: room.rarity,
          category: category as RoomCategory,
          assetUrl: room.assetUrl,
          previewImageUrl: room.imagePreviewUrl,
        },
      });
    }
  }
  console.log('✅ Rooms seeded successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding chest types:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
