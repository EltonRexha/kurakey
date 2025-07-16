'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from '../../libs/axios';
import FillButton from './ui/common/FillButton';
import Link from 'next/link';
import { X } from 'lucide-react';
import coinIcon from '@/assets/images/icons/coin.png';

interface Room {
  name: string;
  previewImageUrl: string;
}

interface Notification {
  id: string;
  type: string;
  message: string;
  createdAt: string;
  isRead: boolean;
  chestType?: { name: string; chestImageUrl: string } | null;
  room?: Room | null;
  achievement?: {
    imageUrl: string;
    unlockMessage: string;
  };
  trade?: {
    id: string;
  };
  coinAmount?: number;
}

interface NotificationApiResponse {
  notifications: Notification[];
  hasMore: boolean;
  total: number;
  page: number;
  pageSize: number;
}

async function markNotificationAsRead(id: string) {
  const res = await axios.post('/notification/mark-read', { id });
  return res.data;
}

const fetchNotifications = async (
  page = 1,
  pageSize = 10
): Promise<NotificationApiResponse> => {
  const res = await axios.get(
    `/notification?page=${page}&pageSize=${pageSize}`
  );
  return res.data as NotificationApiResponse;
};

interface Props {
  onClose: () => void;
}

const NotificationDropdown: React.FC<Props> = ({ onClose }) => {
  const [page, setPage] = useState(1);
  const [allLoaded, setAllLoaded] = useState(false);
  const [allNotifications, setAllNotifications] = useState<Notification[]>([]);
  const pageSize = 10;
  const queryClient = useQueryClient();
  const { data, isLoading, isError } = useQuery<NotificationApiResponse>({
    queryKey: ['notifications', page],
    queryFn: () => fetchNotifications(page, pageSize),
  });

  useEffect(() => {
    if (!data) return;
    if (page === 1) {
      setAllNotifications(data.notifications);
    } else if (data.notifications.length > 0) {
      setAllNotifications((prev) => [...prev, ...data.notifications]);
    }
    if (!data.hasMore) setAllLoaded(true);
  }, [data, page]);

  const notifications: Notification[] =
    allNotifications.length > 0 ? allNotifications : data?.notifications || [];
  const hasMore = data?.hasMore && !allLoaded;

  const handleViewMore = () => {
    if (hasMore) setPage((p) => p + 1);
  };

  const markReadMutation = useMutation({
    mutationFn: markNotificationAsRead,
    // Optimistically update local state so UI reflects the change immediately
    onMutate: async (id: string) => {
      setAllNotifications((prev) =>
        prev.filter((n) => (n.id === id ? false : true))
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['notifications'],
        exact: false,
      });
    },
  });

  return (
    <div className="fixed sm:absolute inset-0 sm:inset-auto sm:right-0 sm:mt-10 w-[100vw] sm:w-80 bg-[#23224a] border border-[#23224a] rounded-lg shadow-lg z-50 pb-2 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#191838]">
        <span className="text-neutral-300 text-sm font-semibold">
          Notifications
        </span>
        <button
          type="button"
          aria-label="Close notifications"
          onClick={onClose}
          className="sm:hidden text-neutral-400 hover:text-red-400 transition-colors"
        >
          <X size={24} />
        </button>
      </div>
      <div className="sm:max-h-80 overflow-y-auto flex flex-col gap-2">
        {isLoading && page === 1 ? (
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
            const markRead = (
              <p
                className="cursor-pointer py-1 text-xs rounded underline text-[#008cff] hover:text-[#005fa3] transition-colors"
                onClick={() => markReadMutation.mutate(notif.id)}
              >
                Mark as read
              </p>
            );
            if (notif.type === 'CHEST_RECEIVED' && notif.chestType) {
              const chestImg = notif.chestType.chestImageUrl;
              return (
                <div
                  key={notif.id}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-[#191838] transition-colors"
                >
                  <div className="mr-auto">
                    <div className="text-[#fbbf24] text-xs">
                      {notif.message}
                    </div>
                    <div className="text-neutral-400 text-xs">
                      {new Date(notif.createdAt).toLocaleString()}
                    </div>
                    {!notif.isRead && markRead}
                  </div>
                  {chestImg && (
                    <Image
                      src={chestImg}
                      alt={notif.chestType.name}
                      width={52}
                      height={52}
                      className="object-contain rounded-md border border-[#23224a] bg-[#23224a]"
                    />
                  )}
                </div>
              );
            }
            if (notif.type === 'ROOM_RECEIVED' && notif.room) {
              return (
                <div
                  key={notif.id}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-[#191838] transition-colors"
                >
                  <div className="mr-auto">
                    <div className="text-[#fbbf24] text-xs font-bold">
                      {notif.message}
                    </div>
                    <div className="text-neutral-400 text-xs">
                      {new Date(notif.createdAt).toLocaleString()}
                    </div>
                    {!notif.isRead && markRead}
                  </div>
                  <Image
                    src={notif.room.previewImageUrl}
                    alt={notif.room.name}
                    width={52}
                    height={52}
                    className="object-contain rounded-md border border-[#23224a] bg-[#23224a]"
                  />
                </div>
              );
            }
            if (notif.type === 'ACHIEVEMENT' && notif.achievement) {
              return (
                <div
                  key={notif.id}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-[#191838] transition-colors"
                >
                  <div className="mr-auto">
                    <div className="text-[#fbbf24] text-xs">
                      {notif.message}
                    </div>
                    <div className="text-neutral-400 text-xs">
                      {new Date(notif.createdAt).toLocaleString()}
                    </div>
                    {!notif.isRead && markRead}
                  </div>
                  <Image
                    src={notif.achievement.imageUrl}
                    alt={notif.achievement.unlockMessage}
                    width={52}
                    height={52}
                    className="object-contain rounded-md border border-[#23224a] bg-[#23224a]"
                  />
                </div>
              );
            }

            if (notif.type === 'TRADE_INVITE') {
              return (
                <div
                  key={notif.id}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-[#191838] transition-colors"
                >
                  <div>
                    <div className="text-[#fbbf24] text-xs font-bold">
                      {notif.message}
                    </div>
                    <div className="text-neutral-400 text-xs">
                      {new Date(notif.createdAt).toLocaleString()}
                    </div>
                    <div className="mt-2 mb-2">
                      <Link href={`/trade?id=${notif.trade?.id}`}>
                        <FillButton fullWidth className="h-8">
                          View Trade
                        </FillButton>
                      </Link>
                    </div>

                    {!notif.isRead && markRead}
                  </div>
                </div>
              );
            }
            if (notif.type === 'TRADE_COMPLETED') {
              return (
                <div
                  key={notif.id}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-[#191838] transition-colors"
                >
                  <div>
                    <div className="text-[#fbbf24] text-xs font-bold">
                      {notif.message}
                    </div>
                    <div className="text-neutral-400 text-xs">
                      {new Date(notif.createdAt).toLocaleString()}
                    </div>
                    <div className="mt-2 mb-2">
                      <Link href={`/trade/completed?id=${notif.trade?.id}`}>
                        <FillButton fullWidth className="h-8">
                          View Trade
                        </FillButton>
                      </Link>
                    </div>
                    {!notif.isRead && markRead}
                  </div>
                </div>
              );
            }
            if (notif.type === 'COIN_RECEIVED') {
              return (
                <div
                  key={notif.id}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-[#191838] transition-colors"
                >
                  <div className="mr-auto">
                    <div className="text-[#fbbf24] text-xs">
                      {notif.message}
                    </div>
                    <div className="text-neutral-400 text-xs">
                      {new Date(notif.createdAt).toLocaleString()}
                    </div>
                    {!notif.isRead && markRead}
                  </div>
                  <Image
                    src={coinIcon}
                    alt={''}
                    width={52}
                    height={52}
                    className="object-contain rounded-md border border-[#23224a] bg-[#23224a]"
                  />
                </div>
              );
            }

            return (
              <div
                key={notif.id}
                className="flex items-center gap-3 px-4 py-3 hover:bg-[#191838] transition-colors"
              >
                <div>
                  <div className="text-[#fbbf24] text-xs font-bold">
                    {notif.message}
                  </div>
                  <div className="text-neutral-400 text-xs">
                    {new Date(notif.createdAt).toLocaleString()}
                  </div>
                  {!notif.isRead && markRead}
                </div>
              </div>
            );
          })
        )}
      </div>
      <div className="mt-auto px-4 py-4 text-center">
        {hasMore && (
          <button
            onClick={handleViewMore}
            className="cursor-pointer text-[#008cff] hover:underline text-base font-medium"
          >
            View More
          </button>
        )}
      </div>
    </div>
  );
};

export default NotificationDropdown;
