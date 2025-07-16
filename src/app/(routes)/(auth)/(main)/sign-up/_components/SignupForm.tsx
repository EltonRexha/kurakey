'use client';
import React, { useState } from 'react';
import { User, Mail, Lock } from 'lucide-react';
import Link from 'next/link';
import { FormInput, GoogleSignInButton, OrDivider } from '@/components/ui/auth';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { UserSchema } from '@/schemas/userSchema';
import { useMutation } from '@tanstack/react-query';
import { signIn } from 'next-auth/react';
import { useToastContext } from '@/context/ToastContext';
import GlowingButton from '@/components/ui/common/GlowingButton';
import { createUser } from '../../../../../../../libs/api/user';

type FormData = z.infer<typeof UserSchema>;

const SignupForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
  } = useForm<FormData>({
    resolver: zodResolver(UserSchema),
  });

  const [error, setError] = useState<null | string>(null);
  const [userIsBanned, setUserIsBanned] = useState(false);
  const [agreed, setAgreed] = useState(false);

  const email = watch('email');
  const password = watch('password');

  const { addToast } = useToastContext();

  const mutateUser = useMutation({
    mutationFn: (data: FormData) => createUser(data),

    onSuccess: () => {
      signIn('credentials', {
        email,
        password,
        callbackUrl: '/',
        redirect: true,
      });
      addToast('Successfully created account', 'success');
    },
    onError: (e: { response: { data: { message: string } } }) => {
      setError(e.response.data.message);
    },
  });

  function onSubmit(data: FormData) {
    mutateUser.mutate(data);
  }
  return (
    <div className="flex gap-8 items-start max-w-[1200px] mx-auto">
      <div className="flex-1">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="flex space-x-2 space-y-4 m-0">
            <div>
              <FormInput
                id="firstName"
                label="First Name"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: 0.1,
                  type: 'spring',
                  stiffness: 100,
                  damping: 12,
                }}
                placeholder="First Name"
                autoComplete="firstName"
                icon={<User />}
                {...register('firstName')}
              />
              {errors.firstName && (
                <p className="my-2 text-sm text-[#ff5f5f]">
                  {errors.firstName.message}
                </p>
              )}
            </div>
            <div>
              <FormInput
                id="lastName"
                label="Last Name"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: 0.1,
                  type: 'spring',
                  stiffness: 100,
                  damping: 12,
                }}
                placeholder="Last Name"
                autoComplete="lastName"
                icon={<User />}
                required={false}
                {...register('lastName')}
              />
              {errors.lastName && (
                <p className="my-2 text-sm text-[#ff5f5f]">
                  {errors.lastName.message}
                </p>
              )}
            </div>
          </div>
          <div>
            <FormInput
              id="username"
              label="Username"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: 0.1,
                type: 'spring',
                stiffness: 100,
                damping: 12,
              }}
              {...register('username')}
              placeholder="Choose a username"
              autoComplete="name"
              icon={<User />}
            />
            {errors.username && (
              <p className="mt-1 text-sm text-[#ff5f5f]">
                {errors.username.message}
              </p>
            )}
          </div>
          <div>
            <FormInput
              id="email"
              label="Email Address"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: 0.2,
                type: 'spring',
                stiffness: 100,
                damping: 12,
              }}
              {...register('email')}
              placeholder="Enter your email address"
              autoComplete="email"
              required
              icon={<Mail />}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-[#ff5f5f]">
                {errors.email.message}
              </p>
            )}
          </div>
          <div>
            <FormInput
              id="password"
              label="Password"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: 0.3,
                type: 'spring',
                stiffness: 100,
                damping: 12,
              }}
              {...register('password')}
              placeholder="Create a password"
              autoComplete="new-password"
              type="password"
              required
              icon={<Lock />}
            />
            {errors.password && (
              <p className="mt-1 text-sm text-[#ff5f5f]">
                {errors.password.message}
              </p>
            )}
          </div>
          <div>
            <FormInput
              id="confirmPassword"
              label="Confirm Password"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: 0.4,
                type: 'spring',
                stiffness: 100,
                damping: 12,
              }}
              {...register('confirmPassword')}
              placeholder="Confirm your password"
              autoComplete="new-password"
              type="password"
              required
              icon={<Lock />}
            />
            {errors.confirmPassword && (
              <p className="mt-1 text-sm text-[#ff5f5f]">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>
          {/* Terms & Privacy agreement */}
          <div className="flex items-center space-x-3 pt-2">
            <input
              type="checkbox"
              id="agree"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="h-5 w-5 cursor-pointer rounded border-gray-600 bg-transparent accent-primary-500 focus:ring-primary-400"
            />
            <label
              htmlFor="agree"
              className="text-xs sm:text-sm text-gray-300 select-none cursor-pointer"
            >
              By continuing, I agree to the{' '}
              <Link
                href="/terms-of-service"
                target="_blank"
                className="text-blue-400 hover:underline"
              >
                Terms&nbsp;of&nbsp;Service
              </Link>{' '}
              and{' '}
              <Link
                href="/privacy-policy"
                target="_blank"
                className="text-blue-400 hover:underline"
              >
                Privacy&nbsp;Policy
              </Link>
              .
            </label>
          </div>
          {error && <p className="mt-1 text-sm text-[#ff5f5f]">{error}</p>}
          {userIsBanned && (
            <p className="mt-1 text-sm text-[#ff5f5f]">
              This user is no longer active
            </p>
          )}
          <GlowingButton
            type="submit"
            fullWidth
            disabled={isSubmitting || !agreed}
          >
            {isSubmitting ? 'SIGNING UP...' : 'SIGN UP'}
          </GlowingButton>
          <OrDivider />
          <GoogleSignInButton setAccountIsInactive={setUserIsBanned} disabled={!agreed} />
        </form>
      </div>
    </div>
  );
};

export default SignupForm;
