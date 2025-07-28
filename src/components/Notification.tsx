'use client';
import React, { useState, useRef, useEffect } from 'react';
import { Bell } from 'lucide-react';
import NotificationDropdown from './NotificationDropdown';

import { motion, AnimatePresence } from 'framer-motion';

interface NotificationProps {
  hasNew?: boolean;
}

const Notification: React.FC<NotificationProps> = ({ hasNew = false }) => {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // lock body scroll ONLY on mobile when the dropdown covers the full screen
  useEffect(() => {
    // Tailwind's `sm` breakpoint is 640px. We only lock the body scroll
    // below that width, where the dropdown is rendered with `fixed` + `inset-0`.
    const isMobile = window.innerWidth < 640;
    const originalOverflow = document.body.style.overflow;

    if (open && isMobile) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = originalOverflow;
    }

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);


  return (
    <div className="sm:relative flex items-center" ref={containerRef}>
      <motion.button
        type="button"
        className="relative p-2 rounded-full transition-colors"
        onClick={() => setOpen((v) => !v)}
        aria-label="Show notifications"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Bell className="w-5 h-5 text-[#fbbf24] cursor-pointer" />
        {hasNew && (
          <motion.span
            className="absolute top-1 right-1 block w-2 h-2 bg-[#ff5f5f] rounded-full ring-2 ring-[#191838]"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
              type: 'spring',
              stiffness: 500,
              damping: 30,
            }}
          />
        )}
      </motion.button>
      <AnimatePresence>
        {open && <NotificationDropdown onClose={() => setOpen(false)} />}
      </AnimatePresence>
    </div>
  );
};

export default Notification;
