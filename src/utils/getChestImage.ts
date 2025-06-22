import starter from '@/assets/images/chests/starter.png';
import advance from '@/assets/images/chests/advance.png';
import elite from '@/assets/images/chests/elite.png';
import mythic from '@/assets/images/chests/mythic.png';
import openedStarter from '@/assets/images/chests/open/starter.png';
import openedAdvance from '@/assets/images/chests/open/advance.png';
import openedElite from '@/assets/images/chests/open/elite.png';
import openedMythic from '@/assets/images/chests/open/mythic.png';
import { StaticImageData } from 'next/image';

const chestImages: Record<string, StaticImageData> = {
  starter: starter,
  advanced: advance,
  elite: elite,
  mythic: mythic,
};

const chestImagesOpen: Record<string, StaticImageData> = {
  starter: openedStarter,
  advanced: openedAdvance,
  elite: openedElite,
  mythic: openedMythic,
};

export const getChestImage = (chestName: string, opened: boolean = false) => {
  if (opened) {
    return chestImagesOpen[chestName.toLowerCase()] || openedStarter;
  }
  return chestImages[chestName.toLowerCase()] || starter;
};
