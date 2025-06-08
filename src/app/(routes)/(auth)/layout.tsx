import React from 'react';

interface AuthLayoutProps {
  children: React.ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#0f1923] p-4 selection:bg-cyan-500/30 selection:text-cyan-300">
      <main className="z-10 w-full">{children}</main>
      <footer className="text-center w-full text-neutral-500 dark:text-neutral-600 text-xs mt-2">
        Kurakey Digital Rooms © {new Date().getFullYear()}
      </footer>
    </div>
  );
};

export default AuthLayout;
