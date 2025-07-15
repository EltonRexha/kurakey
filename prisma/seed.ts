import { PrismaClient, RoomCategory } from '../src/generated/prisma';
import chestDropRates from './data/chestDropRates';
import roomsData from './data/rooms';
import achievementsData from './data/achievements';
import chestTypes from './data/chestTypes';
import coinPackages from './data/coinPackages';
import { v2 as cloudinary } from 'cloudinary';
import path from 'path';
import fs from 'fs';

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const IMAGE_BASE_PATH = path.join(__dirname, 'data', 'images');

function sanitizeLocalPath(p?: string) {
  if (!p) {
    throw new Error('❌ sanitizeLocalPath received an undefined path');
  }
  return p.replace(/^\/+/, '');
}

async function uploadAndOptimize(
  localRelativePath: string,
  context?: string
): Promise<string> {
  if (!localRelativePath) {
    throw new Error(
      `❌ uploadAndOptimize received an empty path${
        context ? ' for ' + context : ''
      }`
    );
  }
  const sanitized = sanitizeLocalPath(localRelativePath);
  const absolutePath = path.join(IMAGE_BASE_PATH, sanitized);
  if (!fs.existsSync(absolutePath)) {
    console.warn(
      `⚠️  Image file not found at ${absolutePath}. Skipping upload for ${
        context ?? sanitized
      }`
    );
    return '';
  }
  const uploadResult = await cloudinary.uploader.upload(absolutePath, {
    folder: `kurakey/${path.dirname(sanitized)}`,
    public_id: path.parse(sanitized).name,
    overwrite: true,
    resource_type: 'image',
  });
  return uploadResult.secure_url.replace('/upload/', '/upload/f_auto,q_auto/');
}

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting to seed chest types and drop rates...');

  for (const chestTypeData of chestTypes) {
    const chestImageUrl = await uploadAndOptimize(
      chestTypeData.chestImageUrl,
      `${chestTypeData.name} → chestImageUrl`
    );
    const chestOpeningGifUrl = await uploadAndOptimize(
      chestTypeData.chestOpeningGifUrl,
      `${chestTypeData.name} → chestOpeningGifUrl`
    );
    const chestOpenedImageUrl = await uploadAndOptimize(
      chestTypeData.chestOpenedImageUrl,
      `${chestTypeData.name} → chestOpenedImageUrl`
    );

    const createdChestType = await prisma.chestType.upsert({
      where: { name: chestTypeData.name },
      update: {
        price: chestTypeData.price,
        xpGain: chestTypeData.xpGain,
        chestImageUrl,
        chestOpeningGifUrl,
        chestOpenedImageUrl,
      },
      create: {
        name: chestTypeData.name,
        price: chestTypeData.price,
        xpGain: chestTypeData.xpGain,
        chestImageUrl,
        chestOpeningGifUrl,
        chestOpenedImageUrl,
      },
    });

    const dropRates = chestDropRates[chestTypeData.name];
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

  //We cannot move this to a separate file because we need to get the chest type ids
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

  const bundleImageMap: Record<string, string> = {
    'Starter Bundle': 'bundles/blueBundle.png',
    'Pro Bundle': 'bundles/greenBundle.png',
    'Elite Bundle': 'bundles/orangeBundle.png',
    'Mythic Bundle': 'bundles/yellowBundle.png',
  };

  for (const bundle of bundleTypes) {
    const imagePath = bundleImageMap[bundle.name];
    const bundleImageUrl = await uploadAndOptimize(
      imagePath,
      `${bundle.name} → bundleImage`
    );

    // Upsert the bundle type
    const createdBundleType = await prisma.bundleType.upsert({
      where: { name: bundle.name },
      update: {
        price: bundle.price,
        coinAmount: bundle.coinAmount,
        bundleImageUrl,
      },
      create: {
        name: bundle.name,
        price: bundle.price,
        coinAmount: bundle.coinAmount,
        bundleImageUrl,
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
  for (const [category, roomsArr] of Object.entries(roomsData)) {
    for (const room of roomsArr) {
      const previewImageUrl = await uploadAndOptimize(
        (room as { imagePreviewUrl?: string }).imagePreviewUrl ?? '',
        `${room.name} preview`
      );
      if (!previewImageUrl) {
        console.warn(
          `⚠️  Skipping room "${room.name}" because preview image is missing.`
        );
        continue;
      }
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
          previewImageUrl,
          isSecret: room.isSecret,
        },
        create: {
          name: room.name,
          rarity: room.rarity,
          category: category as RoomCategory,
          assetUrl: room.assetUrl,
          previewImageUrl,
          isSecret: room.isSecret,
        },
      });
    }
  }
  console.log('✅ Rooms seeded successfully!');

  // --- CoinPackage seeding ---
  console.log('🌱 Seeding coin packages...');

  for (const pkg of coinPackages) {
    const optimizedImageUrl = await uploadAndOptimize(
      pkg.imageUrl,
      `${pkg.name} coin package`
    );
    const existing = await prisma.coinPackage.findFirst({
      where: { price: pkg.price },
    });
    if (existing) {
      await prisma.coinPackage.update({
        where: { id: existing.id },
        data: {
          baseCoins: pkg.baseCoins,
          bonusCoins: pkg.bonusCoins,
          name: pkg.name,
          imageUrl: optimizedImageUrl,
        },
      });
    } else {
      await prisma.coinPackage.create({
        data: {
          price: pkg.price,
          baseCoins: pkg.baseCoins,
          bonusCoins: pkg.bonusCoins,
          name: pkg.name,
          imageUrl: optimizedImageUrl,
        },
      });
    }
  }
  console.log('✅ Coin packages seeded successfully!');

  // --- Achievement seeding ---
  console.log('🌱 Seeding achievements...');
  for (const ach of achievementsData) {
    const achievementImageUrl = await uploadAndOptimize(
      ach.image,
      `${ach.type} achievement`
    );
    await prisma.achievement.upsert({
      where: { type: ach.type },
      update: {
        imageUrl: achievementImageUrl,
        unlockMessage: ach.unlockMessage,
      },
      create: {
        type: ach.type,
        imageUrl: achievementImageUrl,
        unlockMessage: ach.unlockMessage,
      },
    });
  }
  console.log('✅ Achievements seeded successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding chest types:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
