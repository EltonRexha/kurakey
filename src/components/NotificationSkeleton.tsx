import React from 'react';
import { motion } from 'framer-motion';

/**
 * Simple pulsing skeleton used while initial notifications are loading.
 */
const NotificationSkeleton: React.FC = () => {
  const skeletonItems = Array.from({ length: 5 });

  return (
    <div className="flex flex-col gap-2">
      {skeletonItems.map((_, idx) => (
        <motion.div
          key={idx}
          className="flex items-center gap-3 px-4 py-3"
          initial={{ opacity: 0.6 }}
          animate={{ opacity: 1 }}
          transition={{ repeat: Infinity, duration: 1, repeatType: 'reverse' }}
        >
          {/* Text & actions */}
          <div className="flex-1">
            <div className="h-3 w-3/4 mb-2 rounded bg-[#2b2a55] animate-pulse" />
            <div className="h-2 w-1/2 mb-2 rounded bg-[#2b2a55] animate-pulse" />
            <div className="h-2 w-16 rounded bg-[#2b2a55] animate-pulse" />
          </div>
          {/* Thumbnail */}
          <div className="h-10 w-10 rounded bg-[#2b2a55] animate-pulse" />
        </motion.div>
      ))}
    </div>
  );
};

export default NotificationSkeleton;
