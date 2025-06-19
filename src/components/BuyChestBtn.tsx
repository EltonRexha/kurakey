'use client';
import React, { useState } from 'react';
import StarsButton from './ui/StarsButton';
import BuyChestModal from './BuyChestModal';

const BuyChestBtn = ({
  price,
  userBalance,
  chestId,
  chestName,
}: {
  price: number;
  userBalance: number;
  chestId: string;
  chestName: string;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <StarsButton
        fullWidth
        onClick={() => {
          setIsOpen(true);
        }}
      >
        Buy
      </StarsButton>
      <BuyChestModal
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        price={price}
        userCoinBalance={userBalance}
        chestId={chestId}
        chestName={chestName}
      />
    </>
  );
};

export default BuyChestBtn;
