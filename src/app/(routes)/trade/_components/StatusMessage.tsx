import React from 'react'
import { useTradeData } from './TradeContext';

const StatusMessage = () => {

    const { trade } = useTradeData();

    if (trade?.guestConfirmed && !trade?.userConfirmed) {
        return (
            <div>
                <p className='text-sm text-amber-400 animate-pulse font-bold'>
                    Waiting for you to confirm the trade
                </p>
            </div>
        )
    }

    if (trade?.userConfirmed && !trade?.guestConfirmed) {
        return (
            <div>
                <p className='text-sm text-amber-400 animate-pulse font-bold'>
                    Waiting for the other player to confirm the trade
                </p>
            </div>
        )
    }
}

export default StatusMessage
