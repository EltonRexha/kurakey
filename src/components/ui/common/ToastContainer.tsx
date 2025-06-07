import React from 'react';
import { AnimatePresence } from 'framer-motion';
import { Toast as ToastComponent, Toast as ToastType } from './Toast';

interface ToastContainerProps {
  toasts: ToastType[];
  removeToast: (id: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({
  toasts,
  removeToast,
}) => {
  return (
    <div className="fixed top-4 right-4 z-50">
      <AnimatePresence mode="sync">
        {toasts.map((toast) => (
          <ToastComponent key={toast.id} toast={toast} onRemove={removeToast} />
        ))}
      </AnimatePresence>
    </div>
  );
};
