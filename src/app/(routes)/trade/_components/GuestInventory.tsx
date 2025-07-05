'use client';

import React from 'react';
import InventoryGrid from './InventoryGrid';
import { useTradeData } from './TradeContext';
import Avatar from '@/components/ui/common/Avatar';

const GuestInventory: React.FC = () => {
  const { guest } = useTradeData();

  const items = [
    ...guest.chests.map((c) => ({ type: 'chest' as const, data: c })),
    ...guest.rooms.map((r) => ({ type: 'room' as const, data: r })),
  ];

  return (
    <div className="bg-[#0d1024]/30 border border-[#11142d] rounded-lg p-5 w-full">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <Avatar src={guest.image} />
        <span className="text-neutral-100 font-semibold text-lg truncate">
          @{guest.username}
        </span>
      </div>

      <InventoryGrid items={items} />

      {/* Status */}
      <div className="mt-4 text-neutral-100 font-semibold text-center">
        Status:{' '}
        <span className={guest.ready ? 'text-emerald-500' : 'text-red-500'}>
          {guest.ready ? 'Ready' : 'Unready'}
        </span>
      </div>
    </div>
  );
};

export default GuestInventory;
