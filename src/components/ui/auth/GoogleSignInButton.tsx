'use client';
import React from 'react';
import { StyledButton } from '@/components/ui/common';
import { FaGoogle } from 'react-icons/fa';
import { signIn } from 'next-auth/react';

const GoogleSignInButton = () => {
  return (
    <StyledButton
      type="button"
      fullWidth
      onClick={() => {
        signIn('google');
      }}
    >
      <div className="flex items-center justify-center gap-2">
        <FaGoogle className="text-xl" />
        Continue with Google
      </div>
    </StyledButton>
  );
};

export default GoogleSignInButton;
