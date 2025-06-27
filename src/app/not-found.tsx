import GlowingButton from '@/components/ui/common/GlowingButton';
import Link from 'next/link';
import React from 'react';

const page = () => {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center gap-8 bg-[#191838] px-4">
      <div className="flex flex-col items-center gap-6 max-w-2xl">
        <h1
          className="text-[#008cff] font-bold text-8xl font-geist-mono 
          animate-pulse"
        >
          404
        </h1>
        <div className="space-y-4 text-center">
          <p className="text-[#008cff] text-4xl font-geist-sans">
            Page Not Found...
          </p>
          <p className="text-neutral-400 text-sm leading-relaxed hidden sm:block text-pretty">
            Looks like you&apos;ve ventured into uncharted territory. The page you&apos;re
            looking for might have been moved, deleted, or never existed in the
            first place. Don&apos;t worry though, our homepage is just a click away!
          </p>
        </div>
      </div>

      <div className="flex flex-col items-center gap-4">
        <Link href="/" className="hover:no-underline">
          <GlowingButton>Return to Home</GlowingButton>
        </Link>
      </div>
    </div>
  );
};

export default page;
