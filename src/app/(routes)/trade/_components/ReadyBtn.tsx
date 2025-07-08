import FillButton from '@/components/ui/common/FillButton'
import React, { useEffect, useState } from 'react'
import { useTradeData } from './TradeContext';
import { Loader2 } from 'lucide-react';
import { readyTrade } from '../../../../../libs/api/trade';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

const ReadyBtn = ({ readyBtnDisabled }: { readyBtnDisabled: boolean }) => {
    const { trade, isLoading } = useTradeData();
    const [ready, setReady] = useState<boolean | null>(null);
    const [updating, setUpdating] = useState<boolean>(false);
    const router = useRouter();

    const readyMutation = useMutation({
        mutationFn: (ready: boolean) => readyTrade(trade?.id as string, ready),
        onSuccess: () => {
            router.refresh();
        },
        onError: () => {
            setUpdating(false);
        }
    })

    useEffect(() => {
        if (updating) {
            setUpdating(false);
            setReady(trade?.userReady as boolean);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [trade])

    if (readyBtnDisabled) {
        if (trade?.userReady) {
            return (
                <FillButton backgroundColor="bg-red-500 mb-4" fullWidth onClick={handleReady} disabled>
                    Unready
                </FillButton>
            )
        } else {
            return (
                <FillButton backgroundColor="bg-emerald-500 mb-4" fullWidth onClick={handleReady} disabled>
                    Ready
                </FillButton>
            )
        }
    }

    if (isLoading || (ready !== trade?.userReady && ready !== null) && updating) {
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
            setUpdating(true);
        } else {
            readyMutation.mutate(true);
            setReady(true);
            setUpdating(true);
        }
    }

    if (trade?.userConfirmed) {
        return (
            <FillButton backgroundColor="bg-emerald-500 mb-4" fullWidth disabled>
                Ready
            </FillButton>
        )
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
