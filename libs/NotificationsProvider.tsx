"use client";

import React, { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  getUnShownNotifications,
  markNotificationsAsShown,
  Notification,
} from "./api/notifications";
import { useItemNotification } from "@/context/ItemNotificationContext";
import useMounted from "@/hooks/useMounted";

interface Props {
  children: React.ReactNode;
}

const POLL_INTERVAL_MS = 5_000;

const NotificationsProvider: React.FC<Props> = ({ children }) => {
  const { addChest, addXP, addRoom } = useItemNotification();
  const [isReady, setIsReady] = useState(false);
  const mounted = useMounted();

  const { data } = useQuery({
    queryKey: ["un-shown-notifications"],
    queryFn: getUnShownNotifications,
    refetchInterval: POLL_INTERVAL_MS,
    staleTime: 0,
  });

  useEffect(() => {
    if (mounted) {
      const loadingElement = document.getElementById("loading");
      setIsReady(!loadingElement);
    }
  }, [mounted, data]);

  useEffect(() => {
    if (!data || data.length === 0 || !isReady) return;

    data.forEach((notification: Notification) => {
      switch (notification.type) {
        case "CHEST_RECEIVED":
          addChest(notification.message, notification.chestType?.name ?? "");
          break;
        case "XP_GAIN":
          addXP(notification.xpAmount ?? 0);
          break;
        case "ROOM_RECEIVED":
          if (notification.room?.previewImageUrl) {
            addRoom(notification.message, notification.room.previewImageUrl);
          }
          break;
      }
    });

    data.map((n) => {
      markNotificationsAsShown(n.id);
    });
  }, [data, addChest, addXP, addRoom, isReady]);

  return <>{children}</>;
};

export default NotificationsProvider;
