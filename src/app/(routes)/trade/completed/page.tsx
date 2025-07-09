import React, { Suspense } from 'react';
import GetServerUser from '../../../../../libs/GetServerUser';
import prisma from '../../../../../prisma/prisma';
import CompletedTradeWrapper from './_components/CompletedTradeWrapper';
import CompletedTradeWrapperSkeleton from './_components/CompletedTradeWrapperSkeleton';

interface PageProps {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

async function fetchUserTrade(userId: string, tradeId: string) {
    return await prisma.trade.findUnique({
        where: {
            id: tradeId,
            status: 'COMPLETED',
            OR: [
                { receiverId: userId },
                { senderId: userId },
            ],
        },
        select: {
            id: true,
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

    return (
        <div className="max-w-7xl mx-auto px-4 pb-8 pt-16">
            <Suspense fallback={<CompletedTradeWrapperSkeleton />}>
                <CompletedTradeWrapper tradeId={trade.id} />
            </Suspense>
        </div>
    );
};

export default page;
