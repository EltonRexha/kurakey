import { Rarity, RoomCategory } from '@/generated/prisma';

const rooms: Record<
  RoomCategory,
  {
    name: string;
    rarity: Rarity;
    assetUrl: string;
    imagePreviewUrl: string;
    isSecret: boolean;
  }[]
> = {
  ZEN: [
    {
      name: 'Sakura Drift',
      rarity: 'RARE',
      assetUrl: 'https://playcanv.as/p/PYGrc7nr/',
      imagePreviewUrl: '/room-previews/sakuraDrift.png',
      isSecret: false,
    },
  ],
  ASCENSION: [
    {
      name: 'Halo Nexus',
      rarity: 'LEGENDARY',
      assetUrl: 'https://playcanv.as/b/4224df34',
      imagePreviewUrl: '/room-previews/haloNexus.png',
      isSecret: false,
    },
  ],
  COSMIC: [
    {
      name: 'Star Drop',
      rarity: 'COMMON',
      assetUrl: 'https://playcanv.as/b/8460c844',
      imagePreviewUrl: '/room-previews/starDrop.png',
      isSecret: false,
    },
    {
      name: 'Galaxy Gate',
      rarity: 'LEGENDARY',
      assetUrl: 'https://playcanv.as/b/7621c0e2',
      imagePreviewUrl: '/room-previews/galaxyGate.png',
      isSecret: false,
    },
  ],
  INFERNO: [
    {
      name: 'Ember Room',
      rarity: 'COMMON',
      assetUrl: 'https://playcanv.as/p/sTTIbLJ3/',
      imagePreviewUrl: '/room-previews/emberRoom.png',
      isSecret: false,
    },
  ],
  MYSTIC: [
    {
      name: 'Astreal Bloom',
      rarity: 'EPIC',
      assetUrl: 'https://playcanv.as/b/7640ecd5',
      imagePreviewUrl: '/room-previews/astrealBloom.png',
      isSecret: false,
    },
  ],
  NEON: [
    {
      name: 'Neon Mirage',
      rarity: 'LEGENDARY',
      assetUrl: 'https://playcanv.as/b/8ab5f7a3',
      imagePreviewUrl: '/room-previews/neonMirage.png',
      isSecret: false,
    },
    {
      name: 'Side Street',
      rarity: 'COMMON',
      assetUrl: 'https://playcanv.as/p/2qjlLkvX/',
      imagePreviewUrl: '/room-previews/sideStreet.png',
      isSecret: false,
    },
  ],
  RAIN: [
    {
      name: 'Raincode Sencutary',
      rarity: 'LEGENDARY',
      assetUrl: 'https://playcanv.as/b/446f58bb',
      imagePreviewUrl: '/room-previews/rainCodeSencutary.png',
      isSecret: false,
    },
    {
      name: 'Window Pane',
      rarity: 'COMMON',
      assetUrl: 'https://playcanv.as/p/2qjlLkvX',
      imagePreviewUrl: '/room-previews/windowPane.png',
      isSecret: false,
    },
  ],
  SANCTUM: [],
  SECRET: [
    {
      name: 'Secret Room',
      rarity: 'SECRET',
      assetUrl: 'https://playcanv.as/b/343773c3',
      imagePreviewUrl: '/room-previews/secretRoom.png',
      isSecret: true,
    },
  ],
  URBAN: [
    {
      name: 'Rooftop View',
      rarity: 'COMMON',
      assetUrl: 'https://playcanv.as/b/556419e7',
      imagePreviewUrl: '/room-previews/rooftopView.png',
      isSecret: false,
    },
    {
      name: 'Shadow Grid',
      rarity: 'EPIC',
      assetUrl: 'https://playcanv.as/b/b34fc1f7',
      imagePreviewUrl: '/room-previews/shadowGrid.jpg',
      isSecret: false,
    },
  ],
  VOID: [
    {
      name: 'Nothingness',
      rarity: 'LEGENDARY',
      assetUrl: 'https://playcanv.as/b/21b8e142',
      imagePreviewUrl: '/room-previews/nothingness.png',
      isSecret: false,
    },
  ],
  ANIME: [
    {
      name: 'Panel Room',
      rarity: 'COMMON',
      assetUrl: 'https://playcanv.as/b/91c8f67b',
      imagePreviewUrl: '/room-previews/panelRoom.png',
      isSecret: false,
    },
  ],
};

export default rooms;
