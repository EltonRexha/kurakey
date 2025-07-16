'use client';

import { useState, useRef, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Avatar from './Avatar';
import { User, LogOut, Box, LayoutGrid, HandCoins, Users, X } from 'lucide-react';
import Link from 'next/link';
import { signOut } from 'next-auth/react';

interface ProfileProps {
  imageUrl: string;
}

const Profile: React.FC<ProfileProps> = ({ imageUrl }) => {
  const pathname = usePathname();

  // Ordered navigation for mobile (profile first)
  const mobileNavItems = [
    { label: 'Profile', href: '/profile', icon: <User size={16} /> },
    { label: 'Room Index', href: '/rooms', icon: <LayoutGrid size={16} /> },
    { label: 'Search Users', href: '/users', icon: <Users size={16} /> },
    { label: 'Buy Coins', href: '/buy-coins', icon: <HandCoins size={16} /> },
    { label: 'Chests', href: '/', icon: <Box size={16} /> },
  ].filter((item) => item.href !== pathname);
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
      {open && (
        <ul className="fixed sm:absolute left-0 top-0 bottom-0 sm:top-auto sm:bottom-auto sm:left-auto right-0 sm:mt-2 sm:w-40 bg-[#1f1e3f] border border-[#008cff]/50 rounded-md py-1 text-sm shadow-lg z-50">
          {/* Close button (mobile only) */}
          <li
            className="flex justify-end px-4 py-3 sm:hidden text-neutral-200 text-xl cursor-pointer hover:text-red-400"
            onClick={() => setOpen(false)}
          >
            <X size={24} />
          </li>

          {/* Mobile navigation links */}
          {mobileNavItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              onClick={() => setOpen(false)}
              className="px-4 py-3 text-xl sm:text-base hover:bg-[#2b2a55] cursor-pointer text-neutral-200 flex items-center gap-2 hover:text-[#008cff] transition-colors sm:hidden"
            >
              {item.icon}
              {item.label}
            </Link>
          ))}

          {/* Desktop-only links */}
          <Link
            href="/profile"
            className="px-4 py-3 text-xl sm:text-base hover:bg-[#2b2a55] cursor-pointer text-neutral-200 items-center gap-2 hover:text-[#008cff] transition-colors hidden sm:flex"
          >
            <User size={16} />
            Profile
          </Link>
          <li
            className="px-4 py-3 text-xl sm:text-base hover:bg-[#2b2a55] cursor-pointer text-neutral-200 flex items-center gap-2 hover:text-[#008cff] transition-colors"
            onClick={() =>
              signOut({
                callbackUrl: '/log-in',
                redirect: true,
              })
            }
          >
            <LogOut size={16} />
            Logout
          </li>
        </ul>
      )}
    </div>
  );
};

export default Profile;
