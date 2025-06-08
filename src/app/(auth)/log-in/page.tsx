'use client';

import React from 'react';
import Link from 'next/link';
import { AuthLayout, AuthCard } from '@/components/ui/auth';
import LoginForm from './_components/LoginForm';

export default function LoginPage() {
  return (
    <AuthLayout>
      <AuthCard
        title="Login"
        footerContent={
          <p className="text-center text-sm text-neutral-400 dark:text-neutral-500">
            Don&apos;t have an account?{' '}
            <Link
              href="/sign-up"
              className="font-semibold text-[#55f279] hover:text-[#4acf6b] hover:underline"
            >
              Register
            </Link>
          </p>
        }
      >
        <LoginForm />
      </AuthCard>
    </AuthLayout>
  );
}
