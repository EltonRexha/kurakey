import FillButton from '@/components/ui/common/FillButton'
import React, { useState } from 'react'
import { useTradeData } from './TradeContext';
import { Loader2 } from 'lucide-react';
import { readyTrade } from '../../../../../libs/api/trade';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

const ReadyBtn = () => {
    const { trade, isLoading } = useTradeData();
    const [ready, setReady] = useState<boolean | null>(null);
    const router = useRouter();

    const readyMutation = useMutation({
        mutationFn: (ready: boolean) => readyTrade(trade?.id as string, ready),
        onSuccess: () => {
            router.refresh();
        }
    })

    if (isLoading || (ready !== trade?.userReady && ready !== null)) {
        return (
            <FillButton backgroundColor="bg-emerald-500 mb-4 flex items-center justify-center" fullWidth disabled>
                <Loader2 className="animate-spin" />
            </FillButton>
        )
    }

    function handleReady() {
        if (ready) {
            readyMutation.mutate(false);
            setReady(false);
        } else {
            readyMutation.mutate(true);
            setReady(true);
        }
    }


    if (trade?.userReady) {
        return (
            <FillButton backgroundColor="bg-red-500 mb-4" fullWidth onClick={handleReady}>
                Unready
            </FillButton>
        )
    } else {
        return (
            <FillButton backgroundColor="bg-emerald-500 mb-4" fullWidth onClick={handleReady}>
                Ready
            </FillButton>
        )
    }
}

export default ReadyBtn
