'use client';
import React from 'react';
import Image, { StaticImageData } from 'next/image';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { ItemNotification as ItemNotificationType } from '@/context/ItemNotificationContext';
import Link from 'next/link';
import ShineButton from './ShineButton';
import FillButton from './FillButton';

interface Props {
  notification: ItemNotificationType;
  onRemove: (id: string) => void;
}

export const ItemNotification: React.FC<Props> = ({
  notification,
  onRemove,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.9 }}
      className={`bg-[#18173a] border border-[#008cff] shadow-lg rounded-lg p-4 mb-4 flex items-center justify-between min-w-[320px] max-w-xs backdrop-blur-sm backdrop-filter`}
    >
      <div className='flex-1'>
        <div className="flex items-center gap-3">
          {notification.chestImage && notification.chestTypeName && (
            <Image
              src={notification.chestImage as StaticImageData}
              alt={notification.chestTypeName}
              width={40}
              height={40}
              className="object-contain rounded-md border border-[#23224a] bg-[#23224a]"
            />
          )}
          {notification.roomImage && (
            <Image
              src={notification.roomImage}
              alt={''}
              width={40}
              height={40}
              className="object-contain rounded-md border border-[#23224a] bg-[#23224a]"
            />
          )}
          {notification.achievementImage && (
            <Image
              src={notification.achievementImage}
              alt={''}
              width={40}
              height={40}
              className="object-contain rounded-md border border-[#23224a] bg-[#23224a]"
            />
          )}
          <p className="text-[#fbbf24] text-sm font-medium">
            {notification.message}
          </p>
        </div>
        {notification.tradeId ? (
          notification.tradeCompleted ? (
            <Link
              href={`/trade/completed?id=${notification.tradeId}`}
              className="inline-block mt-2 w-full"
            >
              <FillButton type="button" className="h-8" fullWidth>
                View Trade
              </FillButton>
            </Link>
          ) : (
            <Link
              href={`/trade?id=${notification.tradeId}`}
              className="inline-block mt-2 w-full"
            >
              <FillButton type="button" className="h-8" fullWidth>
                View Trade
              </FillButton>
            </Link>
          )
        ) : (
          <></>
        )}
      </div>

      <button
        onClick={() => onRemove(notification.id)}
        className="text-[#008cff] hover:opacity-70 transition-opacity ml-4 p-1 rounded-full relative self-start"
      >
        <X size={16} />
      </button>
    </motion.div>
  );
};
