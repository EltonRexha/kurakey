'use client';

import React, { useState } from 'react';
import { Boxes, Pencil } from 'lucide-react';
import InventoryGrid from './InventoryGrid';
import AddItemModal from './AddItemModal';
import { useTradeData } from './TradeContext';
import Avatar from '@/components/ui/common/Avatar';

const UserInventory: React.FC = () => {
  const { user } = useTradeData();
  const [open, setOpen] = useState(false);

  const items = [
    ...user.chests.map((c) => ({ type: 'chest' as const, data: c })),
    ...user.rooms.map((r) => ({ type: 'room' as const, data: r })),
  ];

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
        <span className={user.ready ? 'text-emerald-500' : 'text-red-500'}>
          {user.ready ? 'Ready' : 'Unready'}
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
