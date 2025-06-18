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
  ASCENSION: [
    {
      name: 'Halo Nexus',
      rarity: 'LEGENDARY',
      assetUrl: 'https://playcanv.as/b/4224df34',
      imagePreviewUrl: '/room-previews/haloNexus.png',
    },
  ],
  COSMIC: [
    {
      name: 'Star Drop',
      rarity: 'COMMON',
      assetUrl: 'https://playcanv.as/b/8460c844',
      imagePreviewUrl: '/room-previews/starDrop.png',
    },
  ],
  INFERNO: [],
  MYSTIC: [
    {
      name: 'Astreal Bloom',
      rarity: 'EPIC',
      assetUrl: 'https://playcanv.as/b/7640ecd5',
      imagePreviewUrl: '/room-previews/astrealBloom.png',
    },
  ],
  NEON: [],
  RAIN: [],
  SANCTUM: [],
  SECRET: [],
  URBAN: [
    {
      name: 'Rooftop View',
      rarity: 'COMMON',
      assetUrl: 'https://playcanv.as/b/556419e7',
      imagePreviewUrl: '/room-previews/rooftopView.png',
    },
  ],
  VOID: [],
};

export default rooms;
