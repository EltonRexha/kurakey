import { Geist, Geist_Mono } from 'next/font/google';
import { ToastProvider } from '@/context/ToastContext';
import ReactQuery from '../../libs/QueryClient';
import './globals.css';
import UserSessionProvider from '../../libs/UserSessionProvider';
import { ItemNotificationProvider } from '@/context/ItemNotificationContext';
import NotificationsProvider from '../../libs/NotificationsProvider';
import PreloadProvider from '@/components/PreloadProvider';
import { PrismaClient } from '../generated/prisma';
import { Metadata } from 'next';
import Head from 'next/head';

// Server-side helper to collect CDN image URLs for preload
async function collectCdnImages(): Promise<string[]> {
  const prisma = new PrismaClient();

  const [chestTypes, coinPackages, bundles, rooms] = await Promise.all([
    prisma.chestType.findMany({
      select: {
        chestImageUrl: true,
      },
    }),
    prisma.coinPackage.findMany({ select: { imageUrl: true } }),
    prisma.bundleType.findMany({ select: { bundleImageUrl: true } }),
    prisma.room.findMany({ select: { previewImageUrl: true } }),
  ]);

  await prisma.$disconnect();

  //The urls to be preloaded include the logo, chest images, coin packages, bundles, and rooms
  const urls = [
    '/logo.png',
    ...chestTypes.flatMap((c) => [c.chestImageUrl]),
    ...coinPackages.map((c) => c.imageUrl),
    ...bundles.map((b) => b.bundleImageUrl),
    ...rooms.map((r) => r.previewImageUrl),
  ];

  return Array.from(new Set(urls.filter(Boolean)));
}

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'KuraKey',
  description:
    'Unlock immersive 3D rooms by opening mysterious chests. Collect, view, and trade animated rooms. Buy coin bundles to get chests and uncover rare experiences.',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const images = await collectCdnImages();

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Head>
          <link
            rel="icon"
            type="image/png"
            href="/favicon-96x96.png"
            sizes="96x96"
          />
          <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
          <link rel="shortcut icon" href="/favicon.ico" />
          <link
            rel="apple-touch-icon"
            sizes="180x180"
            href="/apple-touch-icon.png"
          />
        </Head>
        <UserSessionProvider>
          <ReactQuery>
            <ToastProvider>
              <ItemNotificationProvider>
                <NotificationsProvider>
                  <PreloadProvider images={images}>
                    <div id="modal"></div>
                    <main>{children}</main>
                  </PreloadProvider>
                </NotificationsProvider>
              </ItemNotificationProvider>
            </ToastProvider>
          </ReactQuery>
        </UserSessionProvider>
      </body>
    </html>
  );
}
