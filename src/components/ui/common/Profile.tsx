'use client';

import { useState, useRef, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Avatar from './Avatar';
import {
  User,
  LogOut,
  Box,
  LayoutGrid,
  HandCoins,
  Users,
  X,
} from 'lucide-react';
import Link from 'next/link';
import { signOut, useSession } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';

interface ProfileProps {
  imageUrl: string;
}

const Profile: React.FC<ProfileProps> = ({ imageUrl }) => {
  const pathname = usePathname();
  const { data: session } = useSession();
  const user = session?.user;
  const userId = user?.id;

  const profileLinkActive = () => {
    if (!userId) return false;

    const urlParams = new URLSearchParams(window.location.search);
    const profileId = urlParams.get('id');

    return profileId === userId;
  };

  const allNavItems = [
    { label: 'Profile', href: '/profile', icon: <User size={16} /> },
    { label: 'Room Index', href: '/rooms', icon: <LayoutGrid size={16} /> },
    { label: 'Search Users', href: '/users', icon: <Users size={16} /> },
    { label: 'Buy Coins', href: '/buy-coins', icon: <HandCoins size={16} /> },
    { label: 'Chests', href: '/', icon: <Box size={16} /> },
  ];

  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  const menuVariants = {
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
        staggerChildren: 0.03,
        delayChildren: 0.05,
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

  const isCurrentRoute = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }

    if (href === '/profile') {
      return profileLinkActive();
    }

    return pathname.startsWith(href);
  };

  return (
    <div className="sm:relative" ref={menuRef}>
      <button
        type="button"
        aria-haspopup="true"
        aria-expanded={open}
        onClick={() => setOpen((prev) => !prev)}
        className="cursor-pointer"
      >
        <Avatar src={imageUrl} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.ul
            variants={menuVariants}
            initial="closed"
            animate="open"
            exit="closed"
            className="fixed sm:absolute left-0 top-0 bottom-0 sm:top-auto sm:bottom-auto sm:left-auto right-0 sm:mt-2 sm:w-40 bg-[#1f1e3f] border border-[#008cff]/50 rounded-md py-1 text-sm shadow-lg z-50"
          >
            {/* Close button (mobile only) */}
            <motion.li
              variants={itemVariants}
              className="flex justify-end px-4 py-3 sm:hidden text-neutral-200 text-xl cursor-pointer hover:text-red-400 transition-colors duration-200"
              onClick={() => setOpen(false)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <X size={24} />
            </motion.li>

            {/* Mobile navigation links - show all including current route */}
            {allNavItems.map((item) => {
              const isSelected = isCurrentRoute(item.href);
              return (
                <motion.div
                  key={item.label}
                  variants={itemVariants}
                  whileHover={{
                    x: 5,
                    backgroundColor: isSelected
                      ? 'rgba(0, 140, 255, 0.3)'
                      : 'rgba(43, 42, 85, 1)',
                  }}
                  whileTap={{ scale: 0.98 }}
                  className={`px-4 py-3 text-xl sm:text-base cursor-pointer flex items-center gap-2 transition-all duration-200 sm:hidden ${
                    isSelected
                      ? 'bg-[#008cff]/20 text-[#008cff] border-l-2 border-[#008cff]'
                      : 'text-neutral-200 hover:bg-[#2b2a55] hover:text-[#008cff]'
                  }`}
                >
                  <Link
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-2 w-full"
                  >
                    {item.icon}
                    {item.label}
                    {isSelected && (
                      <motion.div
                        className="ml-auto w-2 h-2 bg-[#008cff] rounded-full"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2 }}
                      />
                    )}
                  </Link>
                </motion.div>
              );
            })}

            <div className="px-4 py-3 text-xl sm:text-base hover:bg-[#2b2a55] cursor-pointer text-neutral-200 items-center gap-2 hover:text-[#008cff] transition-colors hidden sm:flex">
              <Link
                href="/profile"
                className="flex items-center gap-2 w-full"
                onClick={() => setOpen(false)}
              >
                <User size={16} />
                <motion.p
                  variants={itemVariants}
                  className="hidden sm:block w-full"
                  whileHover={{ x: 5 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Profile
                </motion.p>
              </Link>
            </div>

            <div
              className="px-4 py-3 text-xl sm:text-base hover:bg-[#2b2a55] cursor-pointer text-neutral-200 flex items-center gap-2 hover:text-[#008cff] transition-colors"
              onClick={() => {
                setOpen(false);
                signOut({
                  callbackUrl: '/log-in',
                  redirect: true,
                });
              }}
            >
              <LogOut size={16} />
              <motion.p
                variants={itemVariants}
                className="w-full"
                whileHover={{ x: 5 }}
                whileTap={{ scale: 0.98 }}
              >
                Logout
              </motion.p>
            </div>
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Profile;
