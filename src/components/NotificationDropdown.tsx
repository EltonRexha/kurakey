'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from '../../libs/axios';
import FillButton from './ui/common/FillButton';
import Link from 'next/link';
import { X } from 'lucide-react';
import coinIcon from '@/assets/images/icons/coin.png';
import { motion } from 'framer-motion';
import NotificationSkeleton from './NotificationSkeleton';

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

  const dropdownVariants = {
    closed: {
      opacity: 0,
      scale: 0.95,
      y: -10,
      transition: {
        duration: 0.15,
        ease: 'easeInOut',
      },
    },
    open: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: 0.2,
        ease: 'easeOut',
        staggerChildren: 0.02,
        delayChildren: 0.03,
      },
    },
  };

  const itemVariants = {
    closed: {
      opacity: 0,
      x: -20,
      transition: {
        duration: 0.15,
      },
    },
    open: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.2,
        ease: 'easeOut',
      },
    },
  };

  return (
    <motion.div
      variants={dropdownVariants}
      initial="closed"
      animate="open"
      exit="closed"
      className="fixed sm:absolute top-0 inset-0 sm:inset-auto sm:top-0 sm:right-0 sm:mt-10 w-[100vw] sm:w-80 bg-[#23224a] border border-[#23224a] rounded-lg shadow-lg z-50 pb-2 flex flex-col"
    >
      {/* Header */}
      <motion.div
        variants={itemVariants}
        className="flex items-center justify-between px-4 py-3 border-b border-[#191838]"
      >
        <span className="text-neutral-300 text-sm font-semibold">
          Notifications
        </span>
        <motion.button
          type="button"
          aria-label="Close notifications"
          onClick={onClose}
          className="sm:hidden text-neutral-400 hover:text-red-400 transition-colors"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <X size={24} />
        </motion.button>
      </motion.div>
      <div className="sm:max-h-80 overflow-y-auto overflow-x-hidden flex flex-col gap-2">
        {isLoading && page === 1 ? (
          <NotificationSkeleton />
        ) : isError ? (
          <motion.div
            variants={itemVariants}
            className="px-4 py-3 text-red-400 text-sm"
          >
            Failed to load notifications.
          </motion.div>
        ) : notifications.length === 0 ? (
          <motion.div
            variants={itemVariants}
            className="px-4 py-3 text-neutral-400 text-sm"
          >
            No notifications yet.
          </motion.div>
        ) : (
          notifications.map((notif) => {
            const markRead = (
              <div
                className="py-1 text-xs rounded underline text-[#008cff] hover:text-[#005fa3] transition-colors"
              >
                <p className="cursor-pointer inline" onClick={() => markReadMutation.mutate(notif.id)}>Mark as read</p>
              </div>
            );
            if (notif.type === 'CHEST_RECEIVED' && notif.chestType) {
              const chestImg = notif.chestType.chestImageUrl;
              return (
                <motion.div
                  key={notif.id}
                  variants={itemVariants}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-[#191838] transition-colors"
                  whileHover={{ x: 5, backgroundColor: 'rgba(25, 24, 56, 1)' }}
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
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Image
                        src={chestImg}
                        alt={notif.chestType.name}
                        width={52}
                        height={52}
                        className="object-contain rounded-md border border-[#23224a] bg-[#23224a]"
                      />
                    </motion.div>
                  )}
                </motion.div>
              );
            }
            if (notif.type === 'ROOM_RECEIVED' && notif.room) {
              return (
                <motion.div
                  key={notif.id}
                  variants={itemVariants}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-[#191838] transition-colors"
                  whileHover={{ x: 5, backgroundColor: 'rgba(25, 24, 56, 1)' }}
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
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Image
                      src={notif.room.previewImageUrl}
                      alt={notif.room.name}
                      width={52}
                      height={52}
                      className="object-contain rounded-md border border-[#23224a] bg-[#23224a]"
                    />
                  </motion.div>
                </motion.div>
              );
            }
            if (notif.type === 'ACHIEVEMENT' && notif.achievement) {
              return (
                <motion.div
                  key={notif.id}
                  variants={itemVariants}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-[#191838] transition-colors"
                  whileHover={{ x: 5, backgroundColor: 'rgba(25, 24, 56, 1)' }}
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
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Image
                      src={notif.achievement.imageUrl}
                      alt={notif.achievement.unlockMessage}
                      width={52}
                      height={52}
                      className="object-contain rounded-md border border-[#23224a] bg-[#23224a]"
                    />
                  </motion.div>
                </motion.div>
              );
            }

            if (notif.type === 'TRADE_INVITE') {
              return (
                <motion.div
                  key={notif.id}
                  variants={itemVariants}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-[#191838] transition-colors"
                  whileHover={{ x: 5, backgroundColor: 'rgba(25, 24, 56, 1)' }}
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
                        <div>
                          <FillButton fullWidth className="h-8 hover:scale-100">
                            View Trade
                          </FillButton>
                        </div>
                      </Link>
                    </div>

                    {!notif.isRead && markRead}
                  </div>
                </motion.div>
              );
            }
            if (notif.type === 'TRADE_COMPLETED') {
              return (
                <motion.div
                  key={notif.id}
                  variants={itemVariants}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-[#191838] transition-colors"
                  whileHover={{ x: 5, backgroundColor: 'rgba(25, 24, 56, 1)' }}
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
                        <motion.div
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <FillButton fullWidth className="h-8">
                            View Trade
                          </FillButton>
                        </motion.div>
                      </Link>
                    </div>
                    {!notif.isRead && markRead}
                  </div>
                </motion.div>
              );
            }
            if (notif.type === 'COIN_RECEIVED') {
              return (
                <motion.div
                  key={notif.id}
                  variants={itemVariants}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-[#191838] transition-colors"
                  whileHover={{ x: 5, backgroundColor: 'rgba(25, 24, 56, 1)' }}
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
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                  >
                    <Image
                      src={coinIcon}
                      alt={''}
                      width={52}
                      height={52}
                      className="object-contain rounded-md border border-[#23224a] bg-[#23224a]"
                    />
                  </motion.div>
                </motion.div>
              );
            }

            return (
              <motion.div
                key={notif.id}
                variants={itemVariants}
                className="flex items-center gap-3 px-4 py-3 hover:bg-[#191838] transition-colors"
                whileHover={{ x: 5, backgroundColor: 'rgba(25, 24, 56, 1)' }}
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
              </motion.div>
            );
          })
        )}
      </div>
      <motion.div
        variants={itemVariants}
        className="mt-auto px-4 py-4 text-center"
      >
        {isLoading && page > 1 ? (
          <motion.div
            className="flex items-center justify-center gap-1 text-[#008cff] text-xl font-bold"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <motion.span
              animate={{ y: [0, -4, 0] }}
              transition={{ repeat: Infinity, duration: 0.6, delay: 0 }}
            >
              .
            </motion.span>
            <motion.span
              animate={{ y: [0, -4, 0] }}
              transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }}
            >
              .
            </motion.span>
            <motion.span
              animate={{ y: [0, -4, 0] }}
              transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }}
            >
              .
            </motion.span>
          </motion.div>
        ) : (
          hasMore && (
            <motion.button
              onClick={handleViewMore}
              className="cursor-pointer text-[#008cff] hover:underline text-base font-medium"
              whileHover={{ scale: 1.05 }}
            >
              View More
            </motion.button>
          )
        )}
      </motion.div>
    </motion.div>
  );
};

export default NotificationDropdown;
