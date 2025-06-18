import { RoomCategory } from '@/generated/prisma';

export const rarityColors: Record<string, string> = {
  COMMON: '#b0b0b0',
  UNCOMMON: '#4ade80',
  RARE: '#60a5fa',
  EPIC: '#a78bfa',
  LEGENDARY: '#fbbf24',
  SECRET: '#f472b6',
};

export const categoryColors: Record<RoomCategory, string> = {
  ZEN: '#f472b6',
  ASCENSION: '#fbbf24',
  COSMIC: '#60a5fa',
  INFERNO: '#ef4444',
  MYSTIC: '#a78bfa',
  NEON: '#00e0ff',
  RAIN: '#38bdf8',
  SANCTUM: '#facc15',
  SECRET: '#eab308',
  URBAN: '#a3a3a3',
  VOID: '#64748b',
  ANIME: '#ff61d3',
};
