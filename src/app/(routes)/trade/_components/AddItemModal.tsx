/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useState, useEffect } from 'react';
import FullscreenModal from './FullscreenModal';
import { Minus, Plus } from 'lucide-react';
import ChestCard from '@/app/(routes)/profile/_components/ChestCard';
import RoomCard from '@/app/(routes)/profile/_components/RoomCard';
import { useTradeData } from './TradeContext';
import { MoonLoader } from 'react-spinners';
import aggregateChests from '../_utils/aggregateChests';
import aggregateRooms from '../_utils/aggregateRooms';

interface AddItemModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// This component is purely UI. Local state is used so that the + / – buttons
// feel interactive, but nothing gets persisted back to the mock context.
const AddItemModal: React.FC<AddItemModalProps> = ({ isOpen, onClose }) => {
  const { trade, isLoading: tradeLoading } = useTradeData();

  const [chests, setChests] = useState(
    aggregateChests(trade?.senderChests ?? []).map((c) => ({ ...c, selected: 0 }))
  );
  const [rooms, setRooms] = useState(
    aggregateRooms(trade?.senderRooms ?? []).map((r) => ({ ...r, selected: 0 }))
  );



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

  if (tradeLoading || !trade) {
    return (
      <FullscreenModal isOpen={isOpen} onClose={onClose}>
        <div className="flex items-center justify-center min-h-full p-6">
          <MoonLoader color="#008cff" size={80} speedMultiplier={0.9} />
        </div>
      </FullscreenModal>
    );
  }

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
          inc={() => { }}
          dec={() => { }}
        />

      </div>
    </FullscreenModal>
  );
};

interface ItemSelectionGridProps {
  cols: number;
  chests: {
    selected: number;
    type: "chest";
    data: {
      name: string;
      count: number;
      id: string;
    };
  }[];
  rooms: {
    selected: number;
    type: "room";
    data: {
      name: string;
      image: string;
      rarity: string;
      category: string;
      count: number;
      id: string;
    };
  }[];
  setChests: React.Dispatch<React.SetStateAction<{
    selected: number;
    type: "chest";
    data: {
      name: string;
      count: number;
      id: string;
    };
  }[]>>;
  setRooms: React.Dispatch<React.SetStateAction<{
    selected: number;
    type: "room";
    data: {
      name: string;
      image: string;
      rarity: string;
      category: string;
      count: number;
      id: string;
    };
  }[]>>;
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
        <div key={c.data.id} className="flex flex-col items-center">
          <div className="aspect-square min-w-full">
            <ChestCard name={c.data.name} count={c.data.count} />
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
              onClick={() => inc(chests, setChests, idx, c.data.count)}
            >
              <Plus size={16} color="white" />
            </button>
          </div>
        </div>
      ))}

      {rooms.map((r, idx) => (
        <div key={r.data.id} className="flex flex-col items-center">
          <div className="aspect-square w-full">
            <RoomCard
              name={r.data.name}
              image={r.data.image}
              rarity={r.data.rarity}
              category={r.data.category as any}
              count={r.data.count}
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
              onClick={() => inc(rooms, setRooms, idx, r.data.count)}
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
