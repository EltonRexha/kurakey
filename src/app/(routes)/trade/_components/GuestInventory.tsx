'use client';

import React from 'react';
import InventoryGrid from './InventoryGrid';
import { useTradeData } from './TradeContext';
import Avatar from '@/components/ui/common/Avatar';
import aggregateChests from '../_utils/aggregateChests';
import aggregateRooms from '../_utils/aggregateRooms';


const GuestInventory: React.FC = () => {
  const trade = useTradeData();
  const guest = trade.receiver;

  const chestAgg = aggregateChests(trade.receiverChests);
  const roomAgg = aggregateRooms(trade.receiverRooms);

  const items = [...chestAgg, ...roomAgg];

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
        <span className={trade.receiverReady ? 'text-emerald-500' : 'text-red-500'}>
          {trade.receiverReady ? 'Ready' : 'Unready'}
        </span>
      </div>
    </div>
  );
};

export default GuestInventory;
