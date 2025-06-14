'use client';
import React from 'react';
import { FaGoogle } from 'react-icons/fa';
import { signIn } from 'next-auth/react';
import GlowingButton from '../common/GlowingButton';

const GoogleSignInButton = () => {
  return (
    <GlowingButton
      type="button"
      fullWidth
      onClick={() => {
        signIn('google', {
          redirect: true,
          callbackUrl: '/home',
        });
      }}
    >
      <div className="flex items-center justify-center gap-2">
        <FaGoogle className="text-xl" />
        Continue with Google
      </div>
    </GlowingButton>
  );
};

export default GoogleSignInButton;
