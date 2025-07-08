/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useState, useEffect, useRef } from 'react';
import FullscreenModal from './FullscreenModal';
import { Minus, Plus } from 'lucide-react';
import ChestCard from '@/app/(routes)/profile/_components/ChestCard';
import RoomCard from '@/app/(routes)/profile/_components/RoomCard';
import { useTradeData } from './TradeContext';
import { Loader2 } from 'lucide-react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { getInventory } from '../../../../../libs/api/inventory';
import aggregateChests, { AggregatedChest } from '../_utils/aggregateChests';
import aggregateRooms, { AggregatedRoom } from '../_utils/aggregateRooms';
import { updateTrade } from '../../../../../libs/api/trade';

interface AddItemModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type TradeOfferingChests = AggregatedChest & { selected: number };
type TradeOfferingRooms = AggregatedRoom & { selected: number };

const AddItemModal: React.FC<AddItemModalProps> = ({ isOpen, onClose }) => {
  const { trade, isLoading: tradeLoading, setUserInventoryIsLoading } = useTradeData();

  const [chests, setChests] = useState<TradeOfferingChests[]>([]);
  const [rooms, setRooms] = useState<TradeOfferingRooms[]>([]);
  const startChestsRef = useRef<TradeOfferingChests[]>([]);
  const startRoomsRef = useRef<TradeOfferingRooms[]>([]);

  const [cols, setCols] = useState(1);

  const inventoryQuery = useQuery({
    queryKey: ['inventory'],
    queryFn: getInventory,
  });

  useEffect(() => {
    if (!trade || !inventoryQuery.data) return;

    const inventory = inventoryQuery.data.inventory;

    const chestAgg = aggregateChests(inventory.chests);
    const roomAgg = aggregateRooms(inventory.userRooms);

    const tradeChestNames = trade.userChests.map((c) => c.type.name);
    const tradeRoomIds = trade.userRooms.map((r) => r.room.id);

    const chestsWithSelected = chestAgg.map((c) => ({
      ...c,
      selected: tradeChestNames.filter((n) => n === c.data.name).length,
    }));

    const roomsWithSelected = roomAgg.map((r) => ({
      ...r,
      selected: tradeRoomIds.filter((id) => id === r.data.roomId).length,
    }));

    startChestsRef.current = chestsWithSelected;
    startRoomsRef.current = roomsWithSelected;

    setChests(chestsWithSelected);
    setRooms(roomsWithSelected);
  }, [trade, inventoryQuery.data]);

  function inc<T extends { selected: number }>(
    setArr: React.Dispatch<React.SetStateAction<T[]>>,
    idx: number,
    max: number
  ) {
    setArr((prev) => {
      const newArr = [...prev];
      const target = newArr[idx];
      if (target) {
        newArr[idx] = { ...(target as T), selected: Math.min(target.selected + 1, max) } as T;
      }
      return newArr;
    });
  }

  function dec<T extends { selected: number }>(
    setArr: React.Dispatch<React.SetStateAction<T[]>>,
    idx: number
  ) {
    setArr((prev) => {
      const newArr = [...prev];
      const target = newArr[idx];
      if (target) {
        newArr[idx] = { ...(target as T), selected: Math.max(target.selected - 1, 0) } as T;
      }
      return newArr;
    });
  }

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

  const inventoryLoading = inventoryQuery.isLoading;

  const updateTradeMutation = useMutation({
    mutationFn: ({ chests, rooms }: { chests: { chestTypeId: string; quantity: number }[]; rooms: { roomId: string; quantity: number }[] }) =>
      updateTrade(trade?.id ?? '', chests, rooms),
    onError: () => {
      setUserInventoryIsLoading(false);
    },
  });

  if (tradeLoading || !trade || inventoryLoading) {
    return (
      <FullscreenModal isOpen={isOpen} onClose={onClose}>
        <div className="flex items-center justify-center min-h-full p-6">
          <Loader2 className="animate-spin" size={60} color="#008cff" />
        </div>
      </FullscreenModal>
    );
  }

  function onCloseModal() {
    const changed = JSON.stringify(chests) !== JSON.stringify(startChestsRef.current) || JSON.stringify(rooms) !== JSON.stringify(startRoomsRef.current);
    if (!changed) {
      onClose();
      return;
    }

    setUserInventoryIsLoading(true);
    updateTradeMutation.mutate({
      chests: chests.filter((chest) => chest.selected > 0).map((chest) => ({ chestTypeId: chest.data.chestTypeId, quantity: chest.selected })),
      rooms: rooms.filter((room) => room.selected > 0).map((room) => ({ roomId: room.data.roomId, quantity: room.selected })),
    });
    onClose();
  }

  return (
    <FullscreenModal isOpen={isOpen} onClose={onCloseModal}>
      <div className="p-4 flex flex-col min-h-full">
        <h2 className="text-xl font-semibold text-neutral-100 mb-4 flex flex-col gap-2">
          Select Items To Trade
          <span className="text-sm text-neutral-400">
            Remove items by clicking the - button, add items by clicking the +
            button
          </span>
        </h2>

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
  setChests: React.Dispatch<React.SetStateAction<TradeOfferingChests[]>>;
  setRooms: React.Dispatch<React.SetStateAction<TradeOfferingRooms[]>>;

  inc: (
    setArr: React.Dispatch<React.SetStateAction<any>>,
    idx: number,
    max: number
  ) => void;
  dec: (
    setArr: React.Dispatch<React.SetStateAction<any>>,
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
            <ChestCard name={c.data.name} count={c.data.count} countMessage={'You own'} />
          </div>
          <div className="flex items-center gap-2 mt-2">
            {c.selected > 0 ? <button
              className="p-1.5 bg-emerald-600/20 border border-emerald-500 rounded hover:bg-emerald-600/30 cursor-pointer"
              onClick={() => dec(setChests, idx)}
            >
              <Minus size={16} color="white" />
            </button> : <button
              className="p-1.5 bg-gray-600/20 border border-gray-500 rounded disabled cursor-not-allowed"
              onClick={() => dec(setChests, idx)}
            >
              <Minus size={16} color="white" />
            </button>}

            <span className="text-neutral-100 w-6 text-center">
              {c.selected}
            </span>
            {c.selected >= c.data.count ? (
              <button
                className="p-1.5 bg-gray-600/20 border border-gray-500 rounded hover:bg-gray-600/30 disabled cursor-not-allowed"
                onClick={() => inc(setChests, idx, c.data.count)}
              >
                <Plus size={16} color="white" />
              </button>
            ) : (
              <button
                className="p-1.5 bg-emerald-600/20 border border-emerald-500 rounded hover:bg-emerald-600/30 cursor-pointer"
                onClick={() => inc(setChests, idx, c.data.count)}
              >
                <Plus size={16} color="white" />
              </button>
            )}
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
              countMessage={'You own'}
            />
          </div>
          <div className="flex items-center gap-2 mt-2">
            {r.selected > 0 ? <button
              className="p-1.5 bg-emerald-600/20 border border-emerald-500 rounded hover:bg-emerald-600/30 cursor-pointer"
              onClick={() => dec(setRooms, idx)}
            >
              <Minus size={16} color="white" />
            </button> : <button
              className="p-1.5 bg-gray-600/20 border border-gray-500 rounded disabled cursor-not-allowed"
              onClick={() => dec(setRooms, idx)}
            >
              <Minus size={16} color="white" />
            </button>}
            <span className="text-neutral-100 w-6 text-center">
              {r.selected}
            </span>
            {r.selected >= r.data.count ? (
              <button
                className="p-1.5 bg-gray-600/20 border border-gray-500 rounded disabled cursor-not-allowed"
                onClick={() => inc(setRooms, idx, r.data.count)}
              >
                <Plus size={16} color="white" />
              </button>
            ) : (
              <button
                className="p-1.5 bg-emerald-600/20 border border-emerald-500 rounded hover:bg-emerald-600/30 cursor-pointer"
                onClick={() => inc(setRooms, idx, r.data.count)}
              >
                <Plus size={16} color="white" />
              </button>
            )}
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
