import React from 'react';
import AnimatedLogo from './AnimatedLogo'; // Assuming AnimatedLogo.tsx is in the same directory

interface AuthCardProps {
  title?: string; // Title is now optional as logo might be primary focus
  children: React.ReactNode;
  footerContent?: React.ReactNode;
}

const AuthCard: React.FC<AuthCardProps> = ({ title, children, footerContent }) => {
  return (
    <div className="bg-[#1a2c38] border border-[#2c3e50] shadow-2xl shadow-black/50 rounded-xl w-full max-w-lg mx-auto overflow-hidden">
      <div className="p-8 sm:p-10">
        <AnimatedLogo />
        {title && (
          <h2 className="text-xl sm:text-2xl font-semibold text-center text-neutral-100 dark:text-neutral-200 mb-6 sm:mb-8">
            {title}
          </h2>
        )}
        {children}
      </div>
      {footerContent && (
        <div className="bg-[#14222e] px-8 py-5 border-t border-[#2c3e50]">
          {footerContent}
        </div>
      )}
    </div>
  );
};

export default AuthCard;
