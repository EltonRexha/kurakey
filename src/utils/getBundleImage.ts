import blueBundle from '@/assets/images/bundles/blueBundle.png';
import greenBundle from '@/assets/images/bundles/greenBundle.png';
import orangeBundle from '@/assets/images/bundles/orangeBundle.png';
import yellowBundle from '@/assets/images/bundles/yellowBundle.png';
import { StaticImageData } from 'next/image';

const bundleImages: Record<string, StaticImageData> = {
  'starter bundle': blueBundle,
  'pro bundle': yellowBundle,
  'elite bundle': greenBundle,
  'mythic bundle': orangeBundle,
};

export const getBundleImage = (bundleName: string) => {
  return bundleImages[bundleName.toLowerCase()] || blueBundle;
};
