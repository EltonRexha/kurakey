import React from 'react';
import { StaticImageData } from 'next/image';
import prisma from '../../../../../prisma/prisma';
import { getBundleImage } from '@/utils/getBundleImage';
import { getCoinPackageImage } from '@/utils/getCoinPackageImage';
import SuccessPayment from './_components/SuccessPayment';
import { redirect } from 'next/navigation';

interface PageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function Page({ searchParams }: PageProps) {
  const { bundleTypeId, coinPackageId, session_id } = await searchParams;

  const first = (val: string | string[] | undefined) =>
    Array.isArray(val) ? val[0] : val;

  const _bundleTypeId = first(bundleTypeId);
  const _coinPackageId = first(coinPackageId);
  const rawSession = first(session_id);
  const baseSessionId = rawSession ? rawSession.split('?')[0] : undefined;

  if (!baseSessionId) {
    redirect('/');
  }

  type Product = {
    name: string;
    image: StaticImageData;
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
        image: getBundleImage(bundleType.name),
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
        image: getCoinPackageImage(coinPackage.name),
        type: 'coin',
      };
    }
  }

  return <SuccessPayment product={product} />;
}
