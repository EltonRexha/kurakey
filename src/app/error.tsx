'use client';
import GlowingButton from '@/components/ui/common/GlowingButton';
import Link from 'next/link';
import React from 'react';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

const ErrorPage = ({ reset }: ErrorProps) => {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center gap-8 bg-[#191838] px-4">
      <div className="flex flex-col items-center gap-6 max-w-2xl">
        <h1
          className="text-[#ff3860] font-bold text-8xl font-geist-mono 
          animate-pulse"
        >
          Oops!
        </h1>
        <div className="space-y-4 text-center">
          <p className="text-[#ff3860] text-4xl font-geist-sans">
            Something went wrong...
          </p>
          <p className="text-neutral-400 text-sm leading-relaxed hidden sm:block text-pretty">
            An unexpected error has occurred. You can try again or head back to
            our homepage.
          </p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <GlowingButton
          type="button"
          onClick={() => reset()}
          className="hover:no-underline"
        >
          Try Again
        </GlowingButton>
        <Link href="/" className="hover:no-underline">
          <GlowingButton>Return to Home</GlowingButton>
        </Link>
      </div>
    </div>
  );
};

export default ErrorPage;
