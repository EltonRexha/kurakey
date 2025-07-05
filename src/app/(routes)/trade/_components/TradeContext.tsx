'use client';

import React, { createContext, useContext } from 'react';
import { fetchTrade, TradeApiResponse } from '../../../../../libs/api/trade';
import { useQuery } from '@tanstack/react-query';

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

  return (
    <TradeContext.Provider value={{ trade: tradeQuery.data, isLoading: tradeQuery.isLoading }}>{children}</TradeContext.Provider>
  );
};

export const useTradeData = () => useContext(TradeContext);
