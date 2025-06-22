'use client';
import GlowingButton from '@/components/ui/common/GlowingButton';
import { useMutation } from '@tanstack/react-query';
import React from 'react';
import { openChest } from '../../../../../../libs/api/chests';
import { Room } from '@/generated/prisma';
import { useRouter } from 'next/navigation';

interface Props {
  setIsOpening: (isOpen: boolean) => void;
  setUnlockedRoom: (room: Room) => void;
  chestType: string;
}

const OpenChestBtn = ({ setIsOpening, chestType, setUnlockedRoom }: Props) => {
  const router = useRouter();
  const mutation = useMutation({
    mutationFn: openChest,
    onError: () => {},
    onSuccess: (data) => {
      router.refresh();
      setUnlockedRoom(data.room);
    },
  });

  function onOpen() {
    setIsOpening(true);
    mutation.mutate({ chestType });
  }

  return (
    <GlowingButton fullWidth onClick={onOpen}>
      Open
    </GlowingButton>
  );
};

export default OpenChestBtn;
