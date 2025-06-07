"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { AuthLayout, AuthCard, FormInput } from '@/components/ui/auth';
import { StyledButton } from '@/components/ui/common';
import { User, Mail, Lock } from 'lucide-react';

export default function SignUpPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    setError(null);
    setIsLoading(true);
    console.log('Signup attempt with:', { name, email, password });
    // Simulate API call for demonstration
    // In a real app, you would call your backend API for user registration here
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsLoading(false);
    // alert('Signup functionality not implemented on frontend yet.');
  };

  return (
    <AuthLayout>
      <AuthCard 
        title="Register"
        footerContent={
          <p className="text-center text-sm text-neutral-400 dark:text-neutral-500">
            Already have an account?{' '}
            <Link href="/log-in" className="font-semibold text-[#55f279] hover:text-[#4acf6b] hover:underline">
              Log In
            </Link>
          </p>
        }
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <FormInput
            id="username"
            label="Username"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, type: "spring", stiffness: 100, damping: 12 }}
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Choose a username"
            autoComplete="name"
            icon={<User />}
          />
          <FormInput
            id="email"
            label="Email Address"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 100, damping: 12 }}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email address"
            autoComplete="email"
            required
            icon={<Mail />}
          />
          <FormInput
            id="password"
            label="Password"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 100, damping: 12 }}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Create a password"
            autoComplete="new-password"
            required
            icon={<Lock />}
          />
          <FormInput
            id="confirmPassword"
            label="Confirm Password"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, type: "spring", stiffness: 100, damping: 12 }}
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm your password"
            autoComplete="new-password"
            required
            icon={<Lock />}
          />

          {error && (
            <p className="text-sm text-red-500 dark:text-red-400 text-center">{error}</p>
          )}

          <StyledButton type="submit" fullWidth disabled={isLoading}>
            {isLoading ? 'CREATING ACCOUNT...' : 'CREATE ACCOUNT'}
          </StyledButton>
        </form>
      </AuthCard>
    </AuthLayout>
  );
}
