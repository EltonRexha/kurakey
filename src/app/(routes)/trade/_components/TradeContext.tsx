'use client';

import React, { createContext, useContext } from 'react';

export interface Chest {
  id: string;
  name: string;
  count: number;
}

export interface Room {
  id: string;
  name: string;
  image: string;
  rarity: string;
  category: string;
  count: number;
}

interface UserData {
  id: string;
  username: string;
  image: string;
  ready: boolean;
  chests: Chest[];
  rooms: Room[];
}

interface TradeData {
  user: UserData;
  guest: UserData;
  status: 'PENDING' | 'READY' | 'COMPLETED';
}

// Mocked trade data – nothing here changes, it is purely for UI demonstration purposes.
const mockTradeData: TradeData = {
  user: {
    id: 'user-1',
    username: 'You',
    image: '/placeholder-avatar.png',
    ready: false,
    chests: [
      { id: 'c1', name: 'Starter', count: 2 },
      { id: 'c2', name: 'Elite', count: 1 },
    ],
    rooms: [
      {
        id: 'r1',
        name: 'Galaxy Gate',
        image: '/room-previews/galaxyGate.png',
        rarity: 'RARE',
        category: 'COSMIC',
        count: 1,
      },
    ],
  },
  guest: {
    id: 'user-2',
    username: 'GuestUser',
    image: '/placeholder-avatar.png',
    ready: true,
    chests: [{ id: 'c3', name: 'Advanced', count: 1 }],
    rooms: [
      {
        id: 'r2',
        name: 'Sakura Drift',
        image: '/room-previews/sakuraDrift.png',
        rarity: 'COMMON',
        category: 'ZEN',
        count: 1,
      },
    ],
  },
  status: 'PENDING',
};

export const TradeContext = createContext<TradeData>(mockTradeData);

export const TradeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <TradeContext.Provider value={mockTradeData}>
      {children}
    </TradeContext.Provider>
  );
};

export const useTradeData = () => useContext(TradeContext);
