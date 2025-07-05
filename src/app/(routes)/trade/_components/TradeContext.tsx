'use client';

import React, { createContext, useContext } from 'react';
import { TradeApiResponse } from '../../../../../libs/api/trade';

// Matches EXACTLY the shape returned by GET /api/trade/[id]

// --- Mock -------------------------------------------------------------------

const mockTradeApi: TradeApiResponse = {
  id: 'trade-123',
  sender: {
    id: 'user-1',
    username: 'You',
    image: '/placeholder-avatar.png',
  },
  receiver: {
    id: 'user-2',
    username: 'GuestUser',
    image: '/placeholder-avatar.png',
  },
  senderChests: [
    {
      id: 'c1',
      opened: false,
      type: { id: 'ct1', name: 'Starter', price: 0, xpGain: 10 },
    },
    {
      id: 'c2',
      opened: false,
      type: { id: 'ct2', name: 'Elite', price: 0, xpGain: 20 },
    },
  ],
  receiverChests: [
    {
      id: 'c3',
      opened: false,
      type: { id: 'ct3', name: 'Advanced', price: 0, xpGain: 15 },
    },
  ],
  senderRooms: [
    {
      id: 'ur1',
      roomId: 'room1',
      room: {
        id: 'room1',
        name: 'Galaxy Gate',
        category: 'COSMIC',
        rarity: 'RARE',
        previewImageUrl: '/room-previews/galaxyGate.png',
        assetUrl: '/rooms/galaxyGate.glb',
      },
    },
    {
      id: 'ur1123123',
      roomId: 'room1',
      room: {
        id: 'room1',
        name: 'Galaxy Gate',
        category: 'COSMIC',
        rarity: 'RARE',
        previewImageUrl: '/room-previews/galaxyGate.png',
        assetUrl: '/rooms/galaxyGate.glb',
      },
    },
  ],
  receiverRooms: [
    {
      id: 'ur2',
      roomId: 'room2',
      room: {
        id: 'room2',
        name: 'Sakura Drift',
        category: 'ZEN',
        rarity: 'COMMON',
        previewImageUrl: '/room-previews/sakuraDrift.png',
        assetUrl: '/rooms/sakuraDrift.glb',
      },
    },
  ],
  senderReady: false,
  receiverReady: true,
  senderConfirmed: false,
  receiverConfirmed: false,
  status: 'PENDING',
};

// --- Context ----------------------------------------------------------------

export const TradeContext = createContext<TradeApiResponse>(mockTradeApi);

export const TradeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => (
  <TradeContext.Provider value={mockTradeApi}>{children}</TradeContext.Provider>
);

export const useTradeData = () => useContext(TradeContext);
