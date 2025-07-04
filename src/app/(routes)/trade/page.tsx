import React from 'react';
import GetServerUser from '../../../../libs/GetServerUser';
import prisma from '../../../../prisma/prisma';

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

async function userInTrade(userId: string, tradeId: string) {
  return !!(await prisma.trade.findUnique({
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
  }));
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

  const canView = await userInTrade(user.id, params.id as string);

  if (!canView) {
    return 'Trade not found';
  }

  return <div>Trade found</div>;
};

export default page;
