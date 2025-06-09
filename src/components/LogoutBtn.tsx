'use client';

import React from 'react';
import { signOut } from 'next-auth/react';
import { LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useToastContext } from '@/context/ToastContext';

const LogoutBtn = () => {
  const router = useRouter();
  const { addToast } = useToastContext();

  const handleLogout = async () => {
    try {
      await signOut({ redirect: false });
      addToast('Successfully logged out', 'success');
      router.push('/log-in');
    } catch {
      addToast('Failed to log out', 'error');
    }
  };

  return (
    <button onClick={handleLogout} className="flex items-center gap-2 bg-black text-white">
      <LogOut size={18} />
      <span>LOG OUT</span>
    </button>
  );
};

export default LogoutBtn;
