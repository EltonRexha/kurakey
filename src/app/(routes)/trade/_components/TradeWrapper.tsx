'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { TradeProvider } from './TradeContext';
import UserInventory from './UserInventory';
import GuestInventory from './GuestInventory';
import arrows from '@/assets/images/other/arrows.png';
import ReadyBtn from './ReadyBtn';
import CancelBtn from './CancelBtn';
import ConfirmButton from './ConfirmButton';
import StatusMessage from './StatusMessage';

const TradeWrapper: React.FC<{ tradeId: string }> = ({ tradeId }) => {
  const [readyBtnDisabled, setReadyBtnDisabled] = useState(false);
  return (
    <TradeProvider tradeId={tradeId}>
      <div className="flex flex-col items-center gap-6">
        <div className="flex flex-col lg:flex-row items-center lg:items-start gap-6 w-[90%] lg:w-full">
          <UserInventory />

          <div className="flex flex-col items-center justify-center flex-shrink-0 self-center">
            <Image
              src={arrows}
              alt="Trade arrows"
              width={180}
              height={180}
              priority
              className="rotate-90 lg:rotate-0 w-24 lg:w-44 h-auto"
            />
          </div>

          <GuestInventory />
        </div>
        <div className="flex flex-col items-center justify-center w-72 sm:w-82">
          <ReadyBtn readyBtnDisabled={readyBtnDisabled} />
          <div className="flex flex-col sm:flex-row gap-4 w-full max-w-sm justify-center">
            <CancelBtn tradeId={tradeId} />
            <ConfirmButton setReadyBtnDisabled={setReadyBtnDisabled} />
          </div>
        </div>
        <StatusMessage />
        <p className="text-sm text-gray-500">
          Trade ID: {tradeId}
        </p>
      </div>
    </TradeProvider>
  );
};

export default TradeWrapper;
