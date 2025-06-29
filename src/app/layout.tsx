import { Geist, Geist_Mono } from 'next/font/google';
import { ToastProvider } from '@/context/ToastContext';
import ReactQuery from '../../libs/QueryClient';
import './globals.css';
import UserSessionProvider from '../../libs/UserSessionProvider';
import { ItemNotificationProvider } from '@/context/ItemNotificationContext';
import NotificationsProvider from '../../libs/NotificationsProvider';

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
        <UserSessionProvider>
          <ReactQuery>
            <ToastProvider>
              <ItemNotificationProvider>
                <NotificationsProvider>
                  <div id="modal"></div>
                  <main>{children}</main>
                </NotificationsProvider>
              </ItemNotificationProvider>
            </ToastProvider>
          </ReactQuery>
        </UserSessionProvider>
      </body>
    </html>
  );
}
