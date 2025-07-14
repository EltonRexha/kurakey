'use client';
import React, { createContext, useContext, useCallback, useState } from 'react';
import { getChestImage } from '@/utils/getChestImage';
import { StaticImageData } from 'next/image';
import { ItemNotificationContainer } from '@/components/ui/common/ItemNotificationContainer';

//FUTURE: IF YOU HAVE IMPLEMENTED ADDING IMAGES OF CHEST TO DATABASE, THIS USES THE FUNCTIONS TO GET THE IMAGES
//YOU NEED TO USE THE DATABASE TO GET THE IMAGE NOW!

export interface ItemNotification {
  id: string;
  message: string;
  chestTypeName?: string;
  chestImage?: StaticImageData;
  roomImage?: string;
  achievementImage?: string;
  tradeId?: string;
  tradeCompleted?: boolean;
  coinAmount?: number;
}

interface ItemNotificationContextType {
  addRoom: (message: string, roomPreviewUrl: string) => void;
  addChest: (message: string, chestTypeName: string) => Promise<void>;
  addXP: (xpAmount: number) => void;
  addAchievement: (message: string, imageUrl: string) => void;
  addTrade: (message: string, tradeId: string) => void;
  addTradeCompleted: (message: string, tradeId: string) => void;
  addOther: (message: string) => void;
  addCoin: (message: string, coinAmount: number) => void;
}

const ItemNotificationContext = createContext<
  ItemNotificationContextType | undefined
>(undefined);

export const ItemNotificationProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [notifications, setNotifications] = useState<ItemNotification[]>([]);

  const removeNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const addChest = useCallback(
    async (message: string, chestTypeName: string) => {
      const chestImage = getChestImage(chestTypeName);
      const id = Math.random().toString(36).slice(2);
      setNotifications((prev) => [
        ...prev,
        {
          id,
          message,
          chestTypeName,
          chestImage,
        },
      ]);
      setTimeout(() => removeNotification(id), 5000);
    },
    [removeNotification]
  );

  const addRoom = useCallback(
    (message: string, roomPreviewUrl: string) => {
      const id = Math.random().toString(36).slice(2);
      setNotifications((prev) => [
        ...prev,
        {
          id,
          message,
          roomImage: roomPreviewUrl,
        },
      ]);
      setTimeout(() => removeNotification(id), 5000);
    },
    [removeNotification]
  );

  const addXP = useCallback(
    (xpAmount: number) => {
      const id = Math.random().toString(36).slice(2);
      setNotifications((prev) => [
        ...prev,
        {
          id,
          message: `${xpAmount}XP got added to your account`,
        },
      ]);
      setTimeout(() => removeNotification(id), 5000);
    },
    [removeNotification]
  );

  const addAchievement = useCallback(
    (message: string, imageUrl: string) => {
      const id = Math.random().toString(36).slice(2);
      setNotifications((prev) => [
        ...prev,
        {
          id,
          message: message,
          achievementImage: imageUrl,
        },
      ]);
      setTimeout(() => removeNotification(id), 5000);
    },
    [removeNotification]
  );

  const addTrade = useCallback(
    (message: string, tradeId: string) => {
      const id = Math.random().toString(36).slice(2);
      setNotifications((prev) => [
        ...prev,
        {
          id,
          message,
          tradeId,
        },
      ]);
      setTimeout(() => removeNotification(id), 5000);
    },
    [removeNotification]
  );

  const addOther = useCallback(
    (message: string) => {
      const id = Math.random().toString(36).slice(2);
      setNotifications((prev) => [...prev, { id, message }]);
      setTimeout(() => removeNotification(id), 5000);
    },
    [removeNotification]
  );

  const addTradeCompleted = useCallback(
    (message: string, tradeId: string) => {
      const id = Math.random().toString(36).slice(2);
      setNotifications((prev) => [
        ...prev,
        { id, message, tradeId, tradeCompleted: true },
      ]);
      setTimeout(() => removeNotification(id), 10000);
    },
    [removeNotification]
  );

  const addCoin = useCallback(
    (message: string, coinAmount: number) => {
      const id = Math.random().toString(36).slice(2);
      setNotifications((prev) => [...prev, { id, message, coinAmount }]);
      setTimeout(() => removeNotification(id), 5000);
    },
    [removeNotification]
  );

  return (
    <ItemNotificationContext.Provider
      value={{
        addChest,
        addXP,
        addRoom,
        addAchievement,
        addTrade,
        addOther,
        addTradeCompleted,
        addCoin,
      }}
    >
      <ItemNotificationContainer
        notifications={notifications}
        removeNotification={removeNotification}
      />
      {children}
    </ItemNotificationContext.Provider>
  );
};

export const useItemNotification = () => {
  const context = useContext(ItemNotificationContext);
  if (!context) {
    throw new Error(
      'useItemNotification must be used within an ItemNotificationProvider'
    );
  }
  return context;
};
