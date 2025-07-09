'use client';

import React, { useState } from 'react';
import { Pencil } from 'lucide-react';
import InventoryGrid from './InventoryGrid';
import AddItemModal from './AddItemModal';
import { useTradeData } from './TradeContext';
import Avatar from '@/components/ui/common/Avatar';
import aggregateChests from '../../_utils/aggregateChests';
import aggregateRooms from '../../_utils/aggregateRooms';
import { Loader2 } from 'lucide-react';
import FillButton from '@/components/ui/common/FillButton';

const UserInventory: React.FC = () => {
  const { trade, isLoading: tradeLoading, userInventoryIsLoading } = useTradeData();
  const [open, setOpen] = useState(false);

  if (tradeLoading || !trade || userInventoryIsLoading) {
    return (
      <div className="relative bg-[#0d1024]/30 border border-[#11142d] rounded-lg p-5 w-full flex items-center justify-center h-[450px]">
        <Loader2 className="animate-spin" size={60} color="#008cff" />
      </div>
    );
  }

  const user = trade.user;

  const chestAgg = aggregateChests(trade.userChests);
  const roomAgg = aggregateRooms(trade.userRooms);

  const items = [...chestAgg, ...roomAgg];

  return (
    <div className='rounded-lg p-5 w-full'>
      <div className="relative bg-[#0d1024]/30 border border-[#11142d] rounded-lg p-5 w-full">
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <Avatar src={user.image} />
          <span className="text-neutral-100 font-semibold text-lg truncate">
            @{user.username}
          </span>
        </div>

        <InventoryGrid items={items} />

        {/* Status */}
        <div className="mt-4 text-neutral-100 font-semibold text-center">
          Status:{' '}
          <span className={trade.userReady ? 'text-emerald-500' : 'text-red-500'}>
            {trade.userReady ? 'Ready' : 'Unready'}
          </span>
        </div>



        <AddItemModal isOpen={open} onClose={() => setOpen(false)} />
      </div>

      {!trade.userReady &&
        <FillButton
          onClick={() => setOpen(true)}
          className="gap-2 mt-4 flex items-center justify-center mx-auto"
        >
          <div className="flex items-center justify-center gap-2">
            <p className='text-sm hidden sm:block'>Add items / Remove items</p>
            <p className='text-sm block sm:hidden'>Add items</p>
            <Pencil size={24} />
          </div>
        </FillButton>
      }
    </div>
  );
};

export default UserInventory;
