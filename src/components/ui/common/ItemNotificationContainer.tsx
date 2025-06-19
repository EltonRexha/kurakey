import React from 'react';
import { ItemNotification } from '@/context/ItemNotificationContext';
import { ItemNotification as ItemNotificationComponent } from './ItemNotification';

interface Props {
  notifications: ItemNotification[];
  removeNotification: (id: string) => void;
}

export const ItemNotificationContainer: React.FC<Props> = ({
  notifications,
  removeNotification,
}) => {
  return (
    <div className="fixed top-6 right-6 z-[9999] flex flex-col items-end gap-2">
      {notifications.map((notification) => (
        <ItemNotificationComponent
          key={notification.id}
          notification={notification}
          onRemove={removeNotification}
        />
      ))}
    </div>
  );
};
