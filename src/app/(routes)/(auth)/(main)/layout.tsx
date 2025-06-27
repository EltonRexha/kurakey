import React from 'react';

interface AuthLayoutProps {
  children: React.ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#080c1c] p-4 selection:bg-blue-500/30 selection:text-blue-300">
      <div className="flex-1">
        <main className="z-10 w-full">{children}</main>
        <footer className="relative bottom-0 text-center w-full text-neutral-500 dark:text-neutral-600 text-xs mt-2">
          Kurakey Digital Rooms © {new Date().getFullYear()}
        </footer>
      </div>
    </div>
  );
};

export default AuthLayout;
