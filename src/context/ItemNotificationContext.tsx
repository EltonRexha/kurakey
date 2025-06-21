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
  chestTypeName: string;
  chestImage?: StaticImageData;
}

interface ItemNotificationContextType {
  addChest: (message: string, chestTypeName: string) => Promise<void>;
  addXP: (xpAmount: number) => void;
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

  const addXP = useCallback(
    (xpAmount: number) => {
      const id = Math.random().toString(36).slice(2);
      setNotifications((prev) => [
        ...prev,
        {
          id,
          message: `${xpAmount}XP got added to your account`,
          chestTypeName: '',
        },
      ]);
      setTimeout(() => removeNotification(id), 5000);
    },
    [removeNotification]
  );

  return (
    <ItemNotificationContext.Provider value={{ addChest, addXP }}>
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
