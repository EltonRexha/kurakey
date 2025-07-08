import FillButton from '@/components/ui/common/FillButton'
import React, { useEffect, useState } from 'react'
import { useTradeData } from './TradeContext';
import { confirmTrade } from '../../../../../../libs/api/trade';
import { useMutation } from '@tanstack/react-query';
import { useToastContext } from '@/context/ToastContext';
import { useRouter } from 'next/navigation';

const ConfirmButton = ({ setReadyBtnDisabled }: { setReadyBtnDisabled: (readyBtnDisabled: boolean) => void }) => {
    const { trade } = useTradeData();
    const [confirmed, setConfirmed] = useState<boolean | null>(null)
    const [updating, setUpdating] = useState<boolean>(false);

    const confirmMutation = useMutation({
        mutationFn: confirmTrade,
        onError: () => {
            setUpdating(false);
            setReadyBtnDisabled(false);
        }
    })

    const { addToast } = useToastContext();
    const router = useRouter();

    function handleConfirm() {
        if (!trade?.id) return;

        setConfirmed(true);
        setUpdating(true);
        setReadyBtnDisabled(true);
        confirmMutation.mutate(trade.id, {
            onSuccess: () => {
                if (trade.guestConfirmed) {
                    addToast('Trade Completed', 'success')
                    router.push(`/trade/completed?id=${trade.id}`);
                    return;
                }
                addToast('Trade Confirmed, waiting for the other player to confirm', 'success')
            },
            onError: () => {
                addToast('Error confirming trade', 'error')
            }
        });
    }

    useEffect(() => {
        if (updating) {
            setUpdating(false);
            setConfirmed(trade?.userConfirmed as boolean);
            setReadyBtnDisabled(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [trade])

    //Loading state while the trade is being confirmed
    if (confirmed !== trade?.userConfirmed && confirmed !== null && updating) {
        return (
            <FillButton backgroundColor="bg-amber-500 animate-pulse" fullWidth disabled>
                Confirming...
            </FillButton>
        )
    }

    if (trade?.userConfirmed) {
        return (
            <FillButton backgroundColor="bg-amber-500" fullWidth disabled>
                Confirmed
            </FillButton>
        )
    }

    if (trade?.userReady && trade?.guestReady) {
        return (
            <FillButton backgroundColor="bg-amber-500" fullWidth onClick={handleConfirm}>
                Confirm Trade
            </FillButton>
        )
    }

    return (
        <FillButton backgroundColor="bg-amber-500" fullWidth disabled>
            Confirm Trade
        </FillButton>
    )
}

export default ConfirmButton
