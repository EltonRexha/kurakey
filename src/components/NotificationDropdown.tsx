'use client';
import { useState } from 'react';
import Image from 'next/image';
import { useQuery } from '@tanstack/react-query';
import { getChestImage } from '@/utils/getChestImage';

interface Room {
  name: string;
  previewImageUrl: string;
}

interface Notification {
  id: string;
  type: string;
  message: string;
  createdAt: string;
  chestType?: { name: string } | null;
  room?: Room | null;
}

interface NotificationApiResponse {
  notifications: Notification[];
  hasMore: boolean;
  total: number;
  page: number;
  pageSize: number;
}

function getChestImageByName(name: string) {
  try {
    return getChestImage(name);
  } catch {
    return undefined;
  }
}

function getRoomImageUrl(room: Room) {
  return room?.previewImageUrl || '';
}

const fetchNotifications = async (
  page = 1,
  pageSize = 10
): Promise<NotificationApiResponse> => {
  const res = await fetch(
    `/api/notification?page=${page}&pageSize=${pageSize}`
  );
  if (!res.ok) throw new Error('Failed to fetch notifications');
  return res.json();
};

const NotificationDropdown = () => {
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const { data, isLoading, isError } = useQuery<NotificationApiResponse>({
    queryKey: ['notifications', page],
    queryFn: () => fetchNotifications(page, pageSize),
  });

  const notifications: Notification[] = data?.notifications || [];
  const hasMore = data?.hasMore;

  return (
    <div className="absolute -right-26 sm:right-0 top-0 mt-10 w-[90vw] sm:w-80 bg-[#23224a] border border-[#23224a] rounded-lg shadow-lg z-50 py-2">
      <div className="px-4 py-2 text-neutral-300 text-sm font-semibold border-b border-[#191838]">
        Notifications
      </div>
      <div className="max-h-64 overflow-y-auto flex flex-col gap-2">
        {isLoading ? (
          <div className="px-4 py-3 text-neutral-400 text-sm">Loading...</div>
        ) : isError ? (
          <div className="px-4 py-3 text-red-400 text-sm">
            Failed to load notifications.
          </div>
        ) : notifications.length === 0 ? (
          <div className="px-4 py-3 text-neutral-400 text-sm">
            No notifications yet.
          </div>
        ) : (
          notifications.map((notif) => {
            if (notif.type === 'CHEST_RECEIVED' && notif.chestType) {
              const chestImg = getChestImageByName(notif.chestType.name);
              return (
                <div
                  key={notif.id}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-[#191838] transition-colors cursor-pointer"
                >
                  {chestImg && (
                    <Image
                      src={chestImg}
                      alt={notif.chestType.name}
                      width={32}
                      height={32}
                      className="object-contain rounded-md border border-[#23224a] bg-[#23224a]"
                    />
                  )}
                  <div>
                    <div className="text-[#fbbf24] text-xs font-bold">
                      {notif.message}
                    </div>
                    <div className="text-neutral-400 text-xs">
                      {new Date(notif.createdAt).toLocaleString()}
                    </div>
                  </div>
                </div>
              );
            }
            if (notif.type === 'ROOM_RECEIVED' && notif.room) {
              const roomImg = getRoomImageUrl(notif.room);
              return (
                <div
                  key={notif.id}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-[#191838] transition-colors cursor-pointer"
                >
                  {roomImg && (
                    <Image
                      src={roomImg}
                      alt={notif.room.name}
                      width={32}
                      height={32}
                      className="object-contain rounded-md border border-[#23224a] bg-[#23224a]"
                    />
                  )}
                  <div>
                    <div className="text-[#fbbf24] text-xs font-bold">
                      {notif.message}
                    </div>
                    <div className="text-neutral-400 text-xs">
                      {new Date(notif.createdAt).toLocaleString()}
                    </div>
                  </div>
                </div>
              );
            }
            // Other notification types (XP_GAIN, FRIEND_REQUEST, TRADE_INVITE, etc)
            return (
              <div
                key={notif.id}
                className="flex items-center gap-3 px-4 py-3 hover:bg-[#191838] transition-colors cursor-pointer"
              >
                <div>
                  <div className="text-[#fbbf24] text-xs font-bold">
                    {notif.message}
                  </div>
                  <div className="text-neutral-400 text-xs">
                    {new Date(notif.createdAt).toLocaleString()}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
      <div className="px-4 py-2 text-center text-xs text-[#008cff] cursor-pointer hover:underline">
        {page > 1 && (
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="mr-2"
          >
            Previous
          </button>
        )}
        {hasMore && <button onClick={() => setPage((p) => p + 1)}>Next</button>}
        {!hasMore && 'View all'}
      </div>
    </div>
  );
};

export default NotificationDropdown;
