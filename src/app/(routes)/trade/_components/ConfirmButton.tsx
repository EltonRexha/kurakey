import FillButton from '@/components/ui/common/FillButton'
import React from 'react'
import { useTradeData } from './TradeContext';

const ConfirmButton = () => {
    const { trade } = useTradeData();

    if (trade?.userReady && trade?.guestReady) {
        return (
            <FillButton backgroundColor="bg-amber-500" fullWidth>
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
