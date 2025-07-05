'use client';

import React, { useState } from 'react';
import { Pencil } from 'lucide-react';
import InventoryGrid from './InventoryGrid';
import AddItemModal from './AddItemModal';
import { useTradeData } from './TradeContext';
import Avatar from '@/components/ui/common/Avatar';
import aggregateChests from '../_utils/aggregateChests';
import aggregateRooms from '../_utils/aggregateRooms';

const UserInventory: React.FC = () => {
  const trade = useTradeData();
  const user = trade.sender;
  const [open, setOpen] = useState(false);

  const chestAgg = aggregateChests(trade.senderChests);
  const roomAgg = aggregateRooms(trade.senderRooms);

  const items = [...chestAgg, ...roomAgg];

  return (
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
        <span className={trade.senderReady ? 'text-emerald-500' : 'text-red-500'}>
          {trade.senderReady ? 'Ready' : 'Unready'}
        </span>
      </div>

      <button
        onClick={() => setOpen(true)}
        className="absolute -top-5 -left-5 p-3 bg-[#0d1024] border border-[#11142d] rounded-lg hover:bg-[#008cff]/40 transition cursor-pointer"
        title="Add items / Remove items"
      >
        <Pencil size={24} color="white" />
      </button>

      <AddItemModal isOpen={open} onClose={() => setOpen(false)} />
    </div>
  );
};

export default UserInventory;
