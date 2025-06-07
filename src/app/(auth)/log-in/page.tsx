"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { AuthLayout, AuthCard, FormInput } from '@/components/ui/auth';
import { StyledButton } from '@/components/ui/common';
import { Mail, Lock } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    console.log('Login attempt with:', { email, password });
    // Simulate API call for demonstration
    // In a real app, you would call your NextAuth signIn function here
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsLoading(false);
    // alert('Login functionality not implemented on frontend yet.');
  };

  return (
    <AuthLayout>
      <AuthCard 
        title="Login"
        // Add motion.div wrapper for the card itself if desired for an overall card animation
        // For now, only inputs are animated
        footerContent={
          <p className="text-center text-sm text-neutral-400 dark:text-neutral-500">
            Don&apos;t have an account?{' '}
            <Link href="/sign-up" className="font-semibold text-[#55f279] hover:text-[#4acf6b] hover:underline">
              Register
            </Link>
          </p>
        }
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <FormInput
            id="email"
            label="Email or Username"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email or username"
            required
            icon={<Mail />}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, type: "spring", stiffness: 100, damping: 12 }}
          />
          <FormInput
            id="password"
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            required
            icon={<Lock />}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 100, damping: 12 }}
          />
          
          {/* Optional: Remember me / Forgot password */}
          <div className="flex items-center justify-between text-sm mb-6">
            <Link href="#" className="text-xs font-medium text-cyan-400 hover:text-cyan-300 dark:text-cyan-300 dark:hover:text-cyan-200 hover:underline">
              Forgot password?
            </Link>
          </div>

          <StyledButton type="submit" fullWidth disabled={isLoading}>
            {isLoading ? 'LOGGING IN...' : 'LOG IN'}
          </StyledButton>
        </form>
      </AuthCard>
    </AuthLayout>
  );
}
