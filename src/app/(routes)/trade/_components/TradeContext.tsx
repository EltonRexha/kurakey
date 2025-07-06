'use client';

import React, { createContext, useContext, useEffect, useRef } from 'react';
import { fetchTrade, TradeApiResponse } from '../../../../../libs/api/trade';
import { useQuery } from '@tanstack/react-query';
import { useToastContext } from '@/context/ToastContext';

export const TradeContext = createContext<{ trade: TradeApiResponse | undefined, isLoading: boolean }>({ trade: undefined, isLoading: true });

export const TradeProvider: React.FC<{ children: React.ReactNode, tradeId: string }> = ({
  children,
  tradeId,
}) => {
  const tradeQuery = useQuery({
    queryKey: ['trade', tradeId],
    queryFn: () => fetchTrade(tradeId),
    refetchInterval: 5000,
  });

  const { addToast } = useToastContext();

  const prevGuestRef = useRef<{ chests: TradeApiResponse['guestChests']; rooms: TradeApiResponse['guestRooms'] } | null>(null);

  useEffect(() => {
    if (!tradeQuery.isLoading && tradeQuery.data) {
      const currentChests = tradeQuery.data.guestChests;
      const currentRooms = tradeQuery.data.guestRooms;

      const prev = prevGuestRef.current;
      if (prev && prevGuestRef.current !== null) {
        const chestsChanged = prev.chests.length !== currentChests.length;
        const roomsChanged = prev.rooms.length !== currentRooms.length;

        if (chestsChanged || roomsChanged) {
          addToast('Guest inventory has changed, review their changes before readying up again', 'warning');
        }
      }

      prevGuestRef.current = { chests: currentChests, rooms: currentRooms };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tradeQuery.data]);

  return (
    <TradeContext.Provider value={{ trade: tradeQuery.data, isLoading: tradeQuery.isLoading }}>{children}</TradeContext.Provider>
  );
};

export const useTradeData = () => useContext(TradeContext);
