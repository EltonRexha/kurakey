import React, { Suspense } from 'react';
import Image from 'next/image';
import prisma from '../../../../../../prisma/prisma';
import CompletedUserInventory from './CompletedUserInventory';
import CompletedGuestInventory from './CompletedGuestInventory';
import InventorySkeleton from './InventorySkeleton';
import arrows from '@/assets/images/other/arrows.png';

async function fetchTradeMeta(tradeId: string) {
    return await prisma.trade.findUnique({
        where: {
            id: tradeId,
            status: 'COMPLETED',
        },
        select: {
            updatedAt: true,
        },
    });
}

interface Props {
    tradeId: string;
}

const CompletedTradeWrapper: React.FC<Props> = async ({ tradeId }) => {
    const trade = await fetchTradeMeta(tradeId);
    if (!trade) return null;

    const completedDate = trade.updatedAt.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    return (
      <div className="flex flex-col items-center gap-6">
        <div className="flex flex-col lg:flex-row items-center lg:items-start gap-6 w-[90%] lg:w-full">
          {/* Logged-in user inventory */}
          <Suspense fallback={<InventorySkeleton />}>
            <CompletedUserInventory tradeId={tradeId} />
          </Suspense>

          {/* Arrow */}
          <div className="flex flex-col items-center justify-center flex-shrink-0 self-center">
            <Image
              src={arrows}
              alt="Trade arrows"
              width={180}
              height={180}
              priority
              className="rotate-90 lg:rotate-0 w-24 lg:w-44 h-auto"
            />
          </div>

          {/* Guest inventory */}
          <Suspense fallback={<InventorySkeleton />}>
            <CompletedGuestInventory tradeId={tradeId} />
          </Suspense>
        </div>

        {/* Completed header */}
        <h2 className="text-2xl font-bold text-emerald-400">Trade Completed</h2>

        {/* Meta */}
        <p className="text-sm text-gray-500 text-center">
          Trade ID: {tradeId}
        </p>
        <p className="text-sm text-gray-500 text-center">
          Completed on {completedDate}
        </p>
      </div>
    );
};

export default CompletedTradeWrapper; 