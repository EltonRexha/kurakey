/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useState, useEffect } from 'react';
import FullscreenModal from './FullscreenModal';
import { Minus, Plus } from 'lucide-react';
import ChestCard from '@/app/(routes)/profile/_components/ChestCard';
import RoomCard from '@/app/(routes)/profile/_components/RoomCard';
import GlowingButton from '@/components/ui/common/GlowingButton';
import { useTradeData } from './TradeContext';

interface AddItemModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// This component is purely UI. Local state is used so that the + / – buttons
// feel interactive, but nothing gets persisted back to the mock context.
const AddItemModal: React.FC<AddItemModalProps> = ({ isOpen, onClose }) => {
  const trade = useTradeData();

  const [chests, setChests] = useState(
    trade.senderChests.map((c) => ({ ...c, selected: 0 }))
  );
  const [rooms, setRooms] = useState(
    trade.senderRooms.map((r) => ({ ...r, selected: 0 }))
  );

  const inc = (
    arr: any[],
    setArr: React.Dispatch<React.SetStateAction<any[]>>,
    idx: number,
    max: number
  ) =>
    setArr(
      arr.map((item, i) =>
        i === idx
          ? { ...item, selected: Math.min(item.selected + 1, max) }
          : item
      )
    );

  const dec = (
    arr: any[],
    setArr: React.Dispatch<React.SetStateAction<any[]>>,
    idx: number
  ) =>
    setArr(
      arr.map((item, i) =>
        i === idx ? { ...item, selected: Math.max(item.selected - 1, 0) } : item
      )
    );

  // Responsive column calculation similar to InventoryGrid
  const [cols, setCols] = useState(1);

  useEffect(() => {
    const calcCols = () => {
      const w = window.innerWidth;
      if (w < 500) return 1;
      if (w < 880) return 3;
      if (w < 1024) return 4;
      if (w < 1280) return 3;
      return 5;
    };
    const handleResize = () => setCols(calcCols());
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <FullscreenModal isOpen={isOpen} onClose={onClose}>
      <div className="p-4 flex flex-col min-h-full">
        <h2 className="text-xl font-semibold text-neutral-100 mb-4 flex flex-col gap-2">
          Select Items To Trade
          <span className="text-sm text-neutral-400">
            Remove items by clicking the - button, add items by clicking the +
            button
          </span>
        </h2>

        {/* Responsive grid mirroring InventoryGrid sizing */}
        <ItemSelectionGrid
          cols={cols}
          chests={chests}
          rooms={rooms}
          setChests={setChests}
          setRooms={setRooms}
          inc={inc}
          dec={dec}
        />

      </div>
    </FullscreenModal>
  );
};

interface ItemSelectionGridProps {
  cols: number;
  chests: any[];
  rooms: any[];
  setChests: React.Dispatch<React.SetStateAction<any[]>>;
  setRooms: React.Dispatch<React.SetStateAction<any[]>>;
  inc: (
    arr: any[],
    setArr: React.Dispatch<React.SetStateAction<any[]>>,
    idx: number,
    max: number
  ) => void;
  dec: (
    arr: any[],
    setArr: React.Dispatch<React.SetStateAction<any[]>>,
    idx: number
  ) => void;
}

const ItemSelectionGrid: React.FC<ItemSelectionGridProps> = ({
  cols,
  chests,
  rooms,
  setChests,
  setRooms,
  inc,
  dec,
}) => {
  const rows = 1;
  const totalItems = chests.length + rooms.length;
  const totalSlots = cols * rows;
  const placeholders = Math.max(totalSlots - totalItems, 0);

  return (
    <div
      className="grid gap-5"
      style={{ gridTemplateColumns: `repeat(${cols}, minmax(130px, 1fr))` }}
    >
      {chests.map((c, idx) => (
        <div key={c.id} className="flex flex-col items-center">
          <div className="aspect-square min-w-full">
            <ChestCard name={c.name} count={c.count} />
          </div>
          <div className="flex items-center gap-2 mt-2">
            <button
              className="p-1.5 bg-emerald-600/20 border border-emerald-500 rounded hover:bg-emerald-600/30 cursor-pointer"
              onClick={() => dec(chests, setChests, idx)}
            >
              <Minus size={16} color="white" />
            </button>
            <span className="text-neutral-100 w-6 text-center">
              {c.selected}
            </span>
            <button
              className="p-1.5 bg-emerald-600/20 border border-emerald-500 rounded hover:bg-emerald-600/30 cursor-pointer"
              onClick={() => inc(chests, setChests, idx, c.count)}
            >
              <Plus size={16} color="white" />
            </button>
          </div>
        </div>
      ))}

      {rooms.map((r, idx) => (
        <div key={r.id} className="flex flex-col items-center">
          <div className="aspect-square w-full">
            <RoomCard
              name={r.name}
              image={r.image}
              rarity={r.rarity}
              category={r.category as any}
              count={r.count}
            />
          </div>
          <div className="flex items-center gap-2 mt-2">
            <button
              className="p-1.5 bg-rose-600/20 border border-rose-500 rounded hover:bg-rose-600/30 cursor-pointer"
              onClick={() => dec(rooms, setRooms, idx)}
            >
              <Minus size={16} color="white" />
            </button>
            <span className="text-neutral-100 w-6 text-center">
              {r.selected}
            </span>
            <button
              className="p-1.5 bg-rose-600/20 border border-rose-500 rounded hover:bg-rose-600/30 cursor-pointer"
              onClick={() => inc(rooms, setRooms, idx, r.count)}
            >
              <Plus size={16} color="white" />
            </button>
          </div>
        </div>
      ))}

      {Array.from({ length: placeholders }).map((_, i) => (
        <div
          key={`ph-${i}`}
          className="aspect-square w-full border border-[#11142d] bg-[#0d1024]/50 rounded-md"
        />
      ))}
    </div>
  );
};

export default AddItemModal;
