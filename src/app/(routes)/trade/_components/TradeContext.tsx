'use client';

import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { fetchTrade, TradeApiResponse } from '../../../../../libs/api/trade';
import { useQuery } from '@tanstack/react-query';
import { useToastContext } from '@/context/ToastContext';
import _ from 'lodash';

export const TradeContext = createContext<{ trade: TradeApiResponse | undefined, isLoading: boolean, userInventoryIsLoading: boolean, setUserInventoryIsLoading: (isLoading: boolean) => void }>({ trade: undefined, isLoading: true, userInventoryIsLoading: false, setUserInventoryIsLoading: () => { } });

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
  const prevUserRef = useRef<{ chests: TradeApiResponse['userChests']; rooms: TradeApiResponse['userRooms'] } | null>(null);

  const [userInventoryIsLoading, setUserInventoryIsLoading] = useState(false);

  useEffect(() => {
    if (!tradeQuery.isLoading && tradeQuery.data) {
      const currentGuestChests = tradeQuery.data.guestChests;
      const currentGuestRooms = tradeQuery.data.guestRooms;

      const prevGuestData = prevGuestRef.current;
      if (prevGuestData && prevGuestRef.current !== null) {
        const chestsChanged = !_.isEqual(prevGuestData.chests, currentGuestChests);
        const roomsChanged = !_.isEqual(prevGuestData.rooms, currentGuestRooms);

        if (chestsChanged || roomsChanged) {
          addToast('Guest inventory has changed, review their changes before readying up again', 'warning');
        }
      }

      const currentUserChests = tradeQuery.data.userChests;
      const currentUserRooms = tradeQuery.data.userRooms;

      const prevUserData = prevUserRef.current;

      if (prevUserData && prevUserRef.current !== null) {
        const chestsChanged = !_.isEqual(prevUserData.chests, currentUserChests);
        const roomsChanged = !_.isEqual(prevUserData.rooms, currentUserRooms);

        if (chestsChanged || roomsChanged) {
          setUserInventoryIsLoading(false);
        }
      }

      prevUserRef.current = { chests: currentUserChests, rooms: currentUserRooms };
      prevGuestRef.current = { chests: currentGuestChests, rooms: currentGuestRooms };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tradeQuery.data]);

  return (
    <TradeContext.Provider value={{ trade: tradeQuery.data, isLoading: tradeQuery.isLoading, userInventoryIsLoading, setUserInventoryIsLoading }}>{children}</TradeContext.Provider>
  );
};

export const useTradeData = () => useContext(TradeContext);
