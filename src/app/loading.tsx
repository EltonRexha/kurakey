import React from 'react';
import { BounceLoader } from 'react-spinners';
import AnimatedLogo from '@/components/ui/auth/AnimatedLogo';

const Loader = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#191838]">
      <AnimatedLogo width={150} height={50} />
      <div className="mt-8">
        <BounceLoader color="#008cff" speedMultiplier={0.9} size={100} />
      </div>
      <p className="mt-6 text-neutral-300 text-lg tracking-wide animate-pulse">
        Loading Kurakey...
      </p>
    </div>
  );
};

export default Loader;
