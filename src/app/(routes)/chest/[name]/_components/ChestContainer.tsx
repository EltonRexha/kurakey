'use client';
import BuyChestBtn from '@/components/BuyChestBtn';
import GlowingButton from '@/components/ui/common/GlowingButton';
import { $Enums, Room } from '@/generated/prisma';
import { rarityColors } from '@/utils/colors';
import coinIcon from '@/assets/images/icons/coin.png';
import Image from 'next/image';
import React, { useState } from 'react';
import Chest from './Chest';
import OpenChestBtn from './OpenChestBtn';
import RoomUnlockedModal from '@/components/RoomUnlockedModal';
import FloatingParticles from '@/components/ui/common/FloatingParticles';

interface Props {
  chest: {
    id: string;
    name: string;
    price: number;
    rarity: $Enums.Rarity;
    dropRates: {
      rarity: $Enums.Rarity;
      chance: number;
    }[];
    owned: number;
  };
  userCoinBalance?: number;
}

const ChestContainer = ({ chest, userCoinBalance }: Props) => {
  const [chestIsOpening, setChestIsOpening] = useState(false);
  const [unlockedRoom, setUnlockedRoom] = useState<Room | null>(null);
  const [chestIsOpen, setChestIsOpen] = useState(false);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* Left side - Chest Display */}
      <div className="flex flex-col items-center justify-center">
        <Chest
          chest={chest}
          isOpening={chestIsOpening}
          setChestIsOpening={setChestIsOpening}
          setChestIsOpen={setChestIsOpen}
          chestIsOpen={chestIsOpen}
        />
      </div>

      {/* Right side - Chest Info and Odds */}
      <div className="space-y-6">
        <div className="bg-[#191838] border border-[#11142d] rounded-xl p-6">
          <div className="flex justify-between items-start mb-6">
            <h1 className="text-3xl font-bold text-neutral-100">
              {chest.name}
            </h1>
            <div className="flex items-center gap-1.5 bg-[#18173a]/50 px-4 py-2 rounded-lg border border-[#23224a]">
              <span className="text-emerald-500 font-medium text-lg">
                {chest.price}
              </span>
              <Image
                src={coinIcon}
                alt="Coins"
                width={24}
                height={24}
                sizes="24px"
                className="object-contain"
              />
            </div>
          </div>

          {/* Drop Rates Display */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-neutral-100">
              Drop Rates
            </h2>{' '}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {chest.dropRates.map((rate) => (
                <div
                  key={rate.rarity}
                  className="flex flex-col items-center text-xs font-semibold px-2 py-1 rounded transition-all duration-200 hover:scale-105 hover:bg-opacity-20 hover:shadow-[0_0_8px_rgba(var(--rarity-glow-color),0.5)]"
                  style={
                    {
                      color: rarityColors[rate.rarity],
                      background: `${rarityColors[rate.rarity]}22`,
                    } as React.CSSProperties
                  }
                >
                  <span className="uppercase tracking-wide drop-shadow-sm">
                    {rate.rarity.charAt(0) + rate.rarity.slice(1).toLowerCase()}
                  </span>
                  <span className="font-bold text-sm drop-shadow-glow">
                    {rate.chance}%
                  </span>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-2 text-sm text-neutral-400 mt-4 pt-4 border-t border-[#23224a]">
              <span>You own:</span>
              <span className="font-bold text-neutral-300">{chest.owned}</span>
            </div>
            <div className="mt-6 flex justify-center">
              <div className="w-[90%] flex flex-col sm:flex-row gap-2">
                {typeof userCoinBalance === 'number' && (
                  <BuyChestBtn
                    price={chest.price}
                    userBalance={userCoinBalance}
                    chestId={chest.id}
                    chestName={chest.name}
                  />
                )}
                {chest.owned ? (
                  <OpenChestBtn
                    setIsOpening={setChestIsOpening}
                    chestType={chest.name}
                    setUnlockedRoom={setUnlockedRoom}
                  />
                ) : (
                  <GlowingButton fullWidth disabled>
                    Open
                  </GlowingButton>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      {unlockedRoom && !chestIsOpening && (
        <RoomUnlockedModal
          isOpen={true}
          room={unlockedRoom}
          setIsOpen={() => {
            if (unlockedRoom) {
              setUnlockedRoom(null);
              setChestIsOpen(false);
            }
          }}
        />
      )}
    </div>
  );
};

export default ChestContainer;
