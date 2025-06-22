import starter from '@/assets/animations/chests/starter.gif';
import advance from '@/assets/animations/chests/advance.gif';
import elite from '@/assets/animations/chests/elite.gif';
import mythic from '@/assets/animations/chests/mythic.gif';
import { StaticImageData } from 'next/image';

const chestAnimations: Record<string, StaticImageData> = {
  starter: starter,
  advanced: advance,
  elite: elite,
  mythic: mythic,
};

export const getChestAnimation = (chestName: string) => {
  return chestAnimations[chestName.toLowerCase()] || starter;
};
