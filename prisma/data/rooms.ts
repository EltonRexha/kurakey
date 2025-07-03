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
    {
      name: 'Galaxy Gate',
      rarity: 'LEGENDARY',
      assetUrl: 'https://playcanv.as/b/7621c0e2',
      imagePreviewUrl: '/room-previews/galaxyGate.png',
    },
  ],
  INFERNO: [
    {
      name: 'Ember Room',
      rarity: 'COMMON',
      assetUrl: 'https://playcanv.as/p/sTTIbLJ3/',
      imagePreviewUrl: '/room-previews/emberRoom.png',
    },
  ],
  MYSTIC: [
    {
      name: 'Astreal Bloom',
      rarity: 'EPIC',
      assetUrl: 'https://playcanv.as/b/7640ecd5',
      imagePreviewUrl: '/room-previews/astrealBloom.png',
    },
  ],
  NEON: [
    {
      name: 'Neon Mirage',
      rarity: 'LEGENDARY',
      assetUrl: 'https://playcanv.as/b/8ab5f7a3',
      imagePreviewUrl: '/room-previews/neonMirage.png',
    },
    {
      name: 'Side Street',
      rarity: 'COMMON',
      assetUrl: 'https://playcanv.as/p/2qjlLkvX/',
      imagePreviewUrl: '/room-previews/sideStreet.png',
    },
  ],
  RAIN: [
    {
      name: 'Raincode Sencutary',
      rarity: 'LEGENDARY',
      assetUrl: 'https://playcanv.as/b/446f58bb',
      imagePreviewUrl: '/room-previews/rainCodeSencutary.png',
    },
    {
      name: 'Window Pane',
      rarity: 'COMMON',
      assetUrl: 'https://playcanv.as/p/2qjlLkvX',
      imagePreviewUrl: '/room-previews/windowPane.png',
    },
  ],
  SANCTUM: [],
  SECRET: [],
  URBAN: [
    {
      name: 'Rooftop View',
      rarity: 'COMMON',
      assetUrl: 'https://playcanv.as/b/556419e7',
      imagePreviewUrl: '/room-previews/rooftopView.png',
    },
    {
      name: 'Shadow Grid',
      rarity: 'EPIC',
      assetUrl: 'https://playcanv.as/b/b34fc1f7',
      imagePreviewUrl: '/room-previews/shadowGrid.jpg',
    },
  ],
  VOID: [
    {
      name: 'Nothingness',
      rarity: 'LEGENDARY',
      assetUrl: 'https://playcanv.as/b/21b8e142',
      imagePreviewUrl: '/room-previews/nothingness.png',
    },
  ],
  ANIME: [
    {
      name: 'Panel Room',
      rarity: 'COMMON',
      assetUrl: 'https://playcanv.as/b/91c8f67b',
      imagePreviewUrl: '/room-previews/panelRoom.png',
    },
  ],
};

export default rooms;
