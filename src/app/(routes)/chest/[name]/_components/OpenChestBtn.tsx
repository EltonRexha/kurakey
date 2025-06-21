'use client';
import GlowingButton from '@/components/ui/common/GlowingButton';
import React from 'react';

interface Props {
  setIsOpening: (isOpen: boolean) => void;
}

const OpenChestBtn = ({ setIsOpening }: Props) => {
  function onOpen() {
    setIsOpening(true);
  }

  return (
    <GlowingButton fullWidth onClick={onOpen}>
      Open
    </GlowingButton>
  );
};

export default OpenChestBtn;
