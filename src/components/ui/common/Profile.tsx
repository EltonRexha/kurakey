'use client';

import { useState, useRef, useEffect } from 'react';
import Avatar from './Avatar';
import { User, LogOut, Box, LayoutGrid, HandCoins, Users } from 'lucide-react';
import Link from 'next/link';
import { signOut } from 'next-auth/react';

interface ProfileProps {
  imageUrl: string;
}

const Profile: React.FC<ProfileProps> = ({ imageUrl }) => {
  const mobileNavItems = [
    { label: 'Chests', href: '/', icon: <Box size={16} /> },
    { label: 'Buy Coins', href: '/buy-coins', icon: <HandCoins size={16} /> },
    { label: 'Room Index', href: '/rooms', icon: <LayoutGrid size={16} /> },
    { label: 'Search Users', href: '/users', icon: <Users size={16} /> },
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
        <ul className="absolute left-0 sm:left-auto right-0 sm:mt-2 mx-5 sm:mx-0 sm:w-40 bg-[#1f1e3f] border border-[#008cff]/50 rounded-md py-1 text-sm shadow-lg z-50">
          {/* Mobile-only navigation links */}
          {mobileNavItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="px-4 py-3 text-xl sm:text-base hover:bg-[#2b2a55] cursor-pointer text-neutral-200 flex items-center gap-2 hover:text-[#008cff] transition-colors lg:hidden"
            >
              {item.icon}
              {item.label}
            </Link>
          ))}
          <Link
            href="/profile"
            className="px-4 py-3 text-xl sm:text-base hover:bg-[#2b2a55] cursor-pointer text-neutral-200 flex items-center gap-2 hover:text-[#008cff] transition-colors"
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
