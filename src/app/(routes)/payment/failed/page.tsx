import React from 'react';
import { StaticImageData } from 'next/image';
import FailedPayment from './_components/FailedPayment';
import prisma from '../../../../../prisma/prisma';

interface PageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function Page({ searchParams }: PageProps) {
  const { bundleTypeId, coinPackageId, session_id } = await searchParams;

  const first = (val: string | string[] | undefined) =>
    Array.isArray(val) ? val[0] : val;

  let _bundleTypeId = first(bundleTypeId);
  let _coinPackageId = first(coinPackageId);

  // The SDK code that creates the checkout session incorrectly appends additional query parameters to the session_id.
  // Attempt to recover the ids from that param as well so the user still sees product info.
  const extractIdFromSession = (key: string): string | undefined => {
    const raw = first(session_id);
    if (!raw) return undefined;
    const match = raw.match(new RegExp(`[?&]${key}=([^?&]+)`));
    return match ? match[1] : undefined;
  };

  if (!_bundleTypeId) _bundleTypeId = extractIdFromSession('bundleTypeId');
  if (!_coinPackageId) _coinPackageId = extractIdFromSession('coinPackageId');

  type Product = {
    name: string;
    image: string;
    type: 'bundle' | 'coin';
  } | null;

  let product: Product = null;

  if (_bundleTypeId) {
    const bundleType = await prisma.bundleType.findUnique({
      where: { id: _bundleTypeId },
    });
    if (bundleType) {
      product = {
        name: bundleType.name,
        image: bundleType.bundleImageUrl,
        type: 'bundle',
      };
    }
  } else if (_coinPackageId) {
    const coinPackage = await prisma.coinPackage.findUnique({
      where: { id: _coinPackageId },
    });
    if (coinPackage) {
      product = {
        name: coinPackage.name,
        image: coinPackage.imageUrl,
        type: 'coin',
      };
    }
  }

  return <FailedPayment product={product} />;
}
