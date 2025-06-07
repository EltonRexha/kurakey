import React from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';

export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error';
}

interface ToastProps {
  toast: Toast;
  onRemove: (id: string) => void;
}

export const Toast: React.FC<ToastProps> = ({ toast, onRemove }) => {
  const bgColor =
    toast.type === 'success'
      ? 'bg-[#1a392b] border-[#55f279]'
      : 'bg-[#3d1f1f] border-[#ff5f5f]';

  const textColor =
    toast.type === 'success' ? 'text-[#55f279]' : 'text-[#ff5f5f]';

  React.useEffect(() => {
    const timer = setTimeout(() => {
      onRemove(toast.id);
    }, 5000);

    return () => clearTimeout(timer);
  }, [toast.id, onRemove]);

  return (
    <motion.div
      initial={{ opacity: 0, y: -20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.9 }}
      className={`
        ${bgColor}
        border
        shadow-lg
        rounded-lg
        p-4
        mb-4
        flex
        items-center
        justify-between
        backdrop-blur-sm
        backdrop-filter
      `}
    >
      <p className={`${textColor} text-sm font-medium`}>{toast.message}</p>
      <button
        onClick={() => onRemove(toast.id)}
        className={`
          ${textColor}
          hover:opacity-70
          transition-opacity
          ml-4
          p-1
          rounded-full
        `}
      >
        <X size={16} />
      </button>
    </motion.div>
  );
};
