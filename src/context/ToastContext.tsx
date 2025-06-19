'use client';
import React, { createContext, useContext } from 'react';
import { useToaster } from '@/hooks/useToaster';
import { ToastContainer } from '@/components/ui/common/ToastContainer';

interface ToastContextType {
  addToast: (message: string, type: 'success' | 'error') => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { toasts, addToast, removeToast } = useToaster();

  return (
    <ToastContext.Provider value={{ addToast }}>
      <ToastContainer toasts={toasts} removeToast={removeToast} />
      {children}
    </ToastContext.Provider>
  );
};

export const useToastContext = () => {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToastContext must be used within a ToastProvider');
  }
  return context;
};
