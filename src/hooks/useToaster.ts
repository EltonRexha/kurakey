'use client';
import { useState, useCallback } from 'react';
import type { Toast } from '@/components/ui/common/Toast';

export const useToaster = () => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  }, []);

  const addToast = useCallback((message: string, type: 'success' | 'error' | 'warning') => {
    const id = Math.random().toString(36).substr(2, 9);
    const newToast: Toast = {
      id,
      message,
      type,
    };

    setToasts((prevToasts) => [...prevToasts, newToast]);
  }, []);

  return {
    toasts,
    addToast,
    removeToast,
  };
};
