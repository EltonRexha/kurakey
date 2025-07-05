import React from 'react';
import GetServerUser from '../../../../libs/GetServerUser';
import prisma from '../../../../prisma/prisma';
import TradeWrapper from './_components/TradeWrapper';
import { redirect } from 'next/navigation';

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

async function fetchUserTrade(userId: string, tradeId: string) {
  return await prisma.trade.findUnique({
    where: {
      id: tradeId,
      OR: [
        {
          receiver: {
            id: userId,
          },
        },
        {
          sender: {
            id: userId,
          },
        },
      ],
    },
  });
}

const page = async ({ searchParams }: PageProps) => {
  const params = await searchParams;
  const user = await GetServerUser();

  if (!params.id || typeof params.id !== 'string') {
    return 'Not found';
  }

  if (!user) {
    throw new Error('User not found');
  }

  const trade = await fetchUserTrade(user.id, params.id as string);

  if (!trade) {
    return 'Trade not found';
  }

  if (trade.status === 'COMPLETED') {
    return redirect(`/trade/completed?id=${trade.id}`);
  }

  return (
    <div className="max-w-6xl mx-auto px-4 pb-8 pt-16">
      <TradeWrapper />
    </div>
  );
};

export default page;
