import React from 'react';
import Link from 'next/link';
import { AuthLayout, AuthCard } from '@/components/ui/auth';
import SignupForm from './_components/SignupForm';

export default function SignUpPage() {
  return (
    <AuthLayout>
      <AuthCard
        title="Register"
        footerContent={
          <p className="text-center text-sm text-neutral-400 dark:text-neutral-500">
            Already have an account?{' '}
            <Link
              href="/log-in"
              className="font-semibold text-[#55f279] hover:text-[#4acf6b] hover:underline"
            >
              Log In
            </Link>
          </p>
        }
      >
        <SignupForm />
      </AuthCard>
    </AuthLayout>
  );
}
