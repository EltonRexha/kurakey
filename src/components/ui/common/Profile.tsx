"use client";

import { useState, useRef, useEffect } from "react";
import Avatar from "./Avatar";
import { User, LogOut } from "lucide-react";
import Link from "next/link";
import { signOut } from "next-auth/react";

interface ProfileProps {
  imageUrl: string;
}

const Profile: React.FC<ProfileProps> = ({ imageUrl }) => {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  return (
    <div className="relative" ref={menuRef}>
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
        <ul className="absolute right-0 mt-2 w-40 bg-[#1f1e3f] border border-[#008cff]/50 rounded-md py-1 text-sm shadow-lg z-50">
          <Link
            href="/profile"
            className="px-4 py-2 hover:bg-[#2b2a55] cursor-pointer text-neutral-200 flex items-center gap-2 hover:text-[#008cff] transition-colors"
          >
            <User size={16} />
            Profile
          </Link>
          <li
            className="px-4 py-2 hover:bg-[#2b2a55] cursor-pointer text-neutral-200 flex items-center gap-2 hover:text-[#008cff] transition-colors"
            onClick={() => signOut()}
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
