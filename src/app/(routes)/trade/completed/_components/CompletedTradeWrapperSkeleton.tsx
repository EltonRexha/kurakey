'use client';

import Image from 'next/image';
import InventorySkeleton from './InventorySkeleton';
import arrows from '@/assets/images/other/arrows.png';

/**
 * Skeleton that mimics the final completed-trade layout while data loads.
 * Uses two `InventorySkeleton`s and placeholder bars for the header & meta.
 */

const CompletedTradeWrapperSkeleton: React.FC = () => (
    <div className="flex flex-col items-center gap-6 py-8 animate-pulse">
        <div className="flex flex-col lg:flex-row items-center lg:items-start gap-6 w-[90%] lg:w-full">
            <InventorySkeleton />

            {/* Arrow graphic remains static */}
            <div className="flex flex-col items-center justify-center flex-shrink-0 self-center">
                <Image
                    src={arrows}
                    alt="Trade arrows"
                    width={180}
                    height={180}
                    priority
                    className="rotate-90 lg:rotate-0 w-24 lg:w-44 h-auto opacity-50"
                />
            </div>

            <InventorySkeleton />
        </div>

        {/* Header placeholder */}
        <div className="h-6 w-40 bg-[#23224a] rounded" />

        {/* Meta placeholder */}
        <div className="h-4 w-60 bg-[#23224a] rounded" />
    </div>
);

export default CompletedTradeWrapperSkeleton; 