import { Rarity, RoomCategory } from '@/generated/prisma';

const rooms: Record<
  RoomCategory,
  { name: string; rarity: Rarity; assetUrl: string; imagePreviewUrl: string }[]
> = {
  ZEN: [
    {
      name: 'Sakura Drift',
      rarity: 'RARE',
      assetUrl: 'https://playcanv.as/p/PYGrc7nr/',
      imagePreviewUrl: '/room-previews/sakuraDrift.png',
    },
  ],
  ASCENSION: [],
  COSMIC: [],
  INFERNO: [],
  MYSTIC: [
    {
      name: 'Astreal Bloom',
      rarity: 'EPIC',
      assetUrl: 'https://playcanv.as/b/7640ecd5',
      imagePreviewUrl: '/room-previews/astrealBloom.png'
    },
  ],
  NEON: [],
  RAIN: [],
  SANCTUM: [],
  SECRET: [],
  URBAN: [],
  VOID: [],
};

export default rooms;
