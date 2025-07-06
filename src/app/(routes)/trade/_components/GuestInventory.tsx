'use client';

import React from 'react';
import InventoryGrid from './InventoryGrid';
import { useTradeData } from './TradeContext';
import Avatar from '@/components/ui/common/Avatar';
import aggregateChests from '../_utils/aggregateChests';
import aggregateRooms from '../_utils/aggregateRooms';
import { Loader2 } from 'lucide-react';


const GuestInventory: React.FC = () => {
  const { trade, isLoading: tradeLoading } = useTradeData();

  if (tradeLoading || !trade) {
    return (
      <div className="bg-[#0d1024]/30 border border-[#11142d] rounded-lg p-5 w-full flex items-center justify-center h-[450px]">
        <Loader2 className="animate-spin" size={60} color="#008cff" />
      </div>
    );
  }

  const guest = trade.guest;

  const chestAgg = aggregateChests(trade.guestChests);
  const roomAgg = aggregateRooms(trade.guestRooms);

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
        <span className={trade.guestReady ? 'text-emerald-500' : 'text-red-500'}>
          {trade.guestReady ? 'Ready' : 'Unready'}
        </span>
      </div>
    </div>
  );
};

export default GuestInventory;
