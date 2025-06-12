import starter from '@/assets/images/chests/starter.png';
import advance from '@/assets/images/chests/advance.png';
import elite from '@/assets/images/chests/elite.png';
import mythic from '@/assets/images/chests/mythic.png';
import { StaticImageData } from 'next/image';

const chestImages: Record<string, StaticImageData> = {
  'starter': starter,
  'advanced': advance,
  'elite': elite,
  'mythic': mythic,
};

export const getChestImage = (chestName: string) => {
  return chestImages[chestName.toLowerCase()] || starter;
};
