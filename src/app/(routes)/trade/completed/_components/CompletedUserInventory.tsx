import React from 'react';
import Avatar from '@/components/ui/common/Avatar';
import InventoryGrid from '@/app/(routes)/trade/(root)/_components/InventoryGrid';
import aggregateChests from '../../_utils/aggregateChests';
import aggregateRooms from '../../_utils/aggregateRooms';
import prisma from '../../../../../../prisma/prisma';
import GetServerUser from '../../../../../../libs/GetServerUser';

async function fetchUserInventory(tradeId: string, userId: string) {
    return await prisma.trade.findUnique({
        where: {
            id: tradeId,
            status: 'COMPLETED',
            OR: [
                { senderId: userId },
                { receiverId: userId },
            ],
        },
        include: {
            sender: true,
            receiver: true,
            senderChests: { include: { type: true } },
            receiverChests: { include: { type: true } },
            senderRooms: { include: { room: true } },
            receiverRooms: { include: { room: true } },
        },
    });
}

interface Props {
    tradeId: string;
}

const CompletedUserInventory: React.FC<Props> = async ({ tradeId }) => {
    const user = await GetServerUser();
    if (!user) throw new Error('User not found');

    const trade = await fetchUserInventory(tradeId, user.id);
    if (!trade) return null;

    const isSender = trade.senderId === user.id;

    const trader = isSender ? trade.sender : trade.receiver;
    const chests = isSender ? trade.senderChests : trade.receiverChests;
    const rooms = isSender ? trade.senderRooms : trade.receiverRooms;

    const chestAgg = aggregateChests(chests as any);
    const roomAgg = aggregateRooms(rooms as any);
    const items = [...chestAgg, ...roomAgg];

    return (
        <div className="bg-[#0d1024]/30 border border-[#11142d] rounded-lg p-5 w-full">
            {/* Header */}
            <div className="flex items-center gap-3 mb-4">
                <Avatar src={trader.image ?? '/placeholder-avatar.png'} />
                <span className="text-neutral-100 font-semibold text-lg truncate">
                    @{trader.username}
                </span>
            </div>

            <InventoryGrid items={items} />
        </div>
    );
};

export default CompletedUserInventory; 