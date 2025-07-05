import React, { useEffect } from 'react';

interface FullscreenModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const FullscreenModal: React.FC<FullscreenModalProps> = ({
  isOpen,
  onClose,
  children,
}) => {
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[1100] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in">
      <div
        className={`relative w-[95vw] md:w-[75vw] lg:w-[55vw] max-w-none h-[95vh] sm:h-[90vh] overflow-y-auto bg-[#191838] border border-[#23224a] rounded-xl shadow-xl p-6 animate-fade-in`}
      >
        <button
          onClick={onClose}
          className="absolute cursor-pointer top-4 right-4 text-neutral-400 hover:text-white text-2xl font-bold rounded transition-colors duration-200 focus:outline-none"
        >
          ×
        </button>
        {children}
      </div>
    </div>
  );
};

export default FullscreenModal;
