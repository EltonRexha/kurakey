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

  console.log('🌱 Starting to seed chest types...');

  for (const chestType of chestTypes) {
    await prisma.chestType.upsert({
      where: { name: chestType.name },
      update: {},
      create: chestType,
    });
  }

  console.log('✅ Chest types seeded successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding chest types:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
