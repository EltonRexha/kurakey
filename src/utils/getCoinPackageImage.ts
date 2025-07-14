import starter from '@/assets/images/coin-packages/starter.png';
import silver from '@/assets/images/coin-packages/silver.png';
import gold1 from '@/assets/images/coin-packages/gold1.png';
import gold2 from '@/assets/images/coin-packages/gold2.png';
import { StaticImageData } from 'next/image';

const coinPackageImages: Record<string, StaticImageData> = {
  'starter package': starter,
  'silver package': silver,
  'gold package i': gold1,
  'gold package ii': gold2,
};

export const getCoinPackageImage = (packageName: string) => {
  return coinPackageImages[packageName.toLowerCase()] || starter;
};
