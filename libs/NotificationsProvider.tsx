'use client';

import React, { useCallback, useEffect } from 'react';
import {
  getUnShownNotifications,
  markNotificationsAsShown,
  Notification,
} from './api/notifications';
import { useItemNotification } from '@/context/ItemNotificationContext';
import useMounted from '@/hooks/useMounted';
import { useSSE } from '@/hooks/useSSE';
import { useQuery } from '@tanstack/react-query';

interface Props {
  children: React.ReactNode;
}

const NotificationsProvider: React.FC<Props> = ({ children }) => {
  const { addChest, addXP, addRoom, addAchievement, addTrade, addOther, addTradeCompleted } =
    useItemNotification();

  const mounted = useMounted();

  const handleNotification = useCallback(function handleNotification(notification: Notification) {
    switch (notification.type) {
      case 'CHEST_RECEIVED':
        addChest(notification.message, notification.chestType?.name ?? '');
        break;
      case 'XP_GAIN':
        addXP(notification.xpAmount ?? 0);
        break;
      case 'ROOM_RECEIVED':
        if (notification.room?.previewImageUrl) {
          addRoom(notification.message, notification.room.previewImageUrl);
        }
        break;
      case 'ACHIEVEMENT':
        addAchievement(notification.message, notification.achievement.image);
        break;
      case 'TRADE_INVITE':
        addTrade(notification.message, notification.trade.id);
        break;
      case 'TRADE_COMPLETED':
        addTradeCompleted(notification.message, notification.trade.id);
        break;
      default:
        addOther(notification.message);
        break;
    }

    // Mark as shown to avoid duplicate toasts across reloads
    markNotificationsAsShown(notification.id);
  }, [addChest, addXP, addRoom, addAchievement, addTrade, addTradeCompleted, addOther]);

  const unseenNotificationsQuery = useQuery({
    queryKey: ['unseen-notifications'],
    queryFn: getUnShownNotifications,
    enabled: false,
  });

  useEffect(() => {
    if (unseenNotificationsQuery.data) {
      unseenNotificationsQuery.data.forEach(handleNotification);
    }
  }, [unseenNotificationsQuery.data, handleNotification]);

  useSSE({
    url: '/api/sse/stream',
    handlers: {
      NEW_NOTIFICATION: async () => {
        unseenNotificationsQuery.refetch();
      },
    },
    maxRetries: 5,
  });

  return <>{children}</>;
};

export default NotificationsProvider;
