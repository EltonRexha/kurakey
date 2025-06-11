'use client';

import { Geist, Geist_Mono } from 'next/font/google';
import { ToastProvider } from '@/context/ToastContext';
import ReactQuery from '../../libs/QueryClient';
import './globals.css';
import { SessionProvider } from 'next-auth/react';
import Navbar from '@/components/ui/Navbar';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SessionProvider>
          <ReactQuery>
            <ToastProvider>
              <main>{children}</main>
            </ToastProvider>
          </ReactQuery>
        </SessionProvider>
      </body>
    </html>
  );
}
