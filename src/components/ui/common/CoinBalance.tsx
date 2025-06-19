import Image from 'next/image';
import React from 'react';
import GetServerUser from '../../../../libs/GetServerUser';
import coinIcon from '@/assets/images/icons/coin.png';

const CoinBalance = async () => {
  const user = await GetServerUser();

  if(!user){
    return (
      <>
        <p className="text-emerald-500 font-medium">Fetching...</p>
        <Image
          src={coinIcon}
          alt="Coins"
          width={20}
          height={20}
          sizes="20px"
          className="object-contain"
        />
      </>
    );
   
  }

  return (
    <>
      <p className="text-emerald-500 font-medium">{user.coinBalance}</p>{' '}
      <Image
        src={coinIcon}
        alt="Coins"
        width={20}
        height={20}
        sizes="20px"
        className="object-contain"
      />
    </>
  );
};

export default CoinBalance;
