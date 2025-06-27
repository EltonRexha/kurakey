'use client';
import { AuthCard, FormInput } from '@/components/ui/auth';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { User } from 'lucide-react';
import { useSession } from 'next-auth/react';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { createOAuthUser } from '../../../../../libs/api/oauthUser';
import { ClipLoader } from 'react-spinners';
import { useRouter } from 'next/navigation';
import GlowingButton from '@/components/ui/common/GlowingButton';

const FormSchema = z.object({
  username: z
    .string()
    .min(6, 'Username must be at least 6 characters long')
    .regex(
      /^[a-zA-Z0-9_]+$/,
      'Username can only contain letters, numbers and underscore'
    )
    .regex(/^\S*$/, 'Username cannot contain spaces'),
});

type Input = z.infer<typeof FormSchema>;

export default function FinishAuthPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Input>({
    resolver: zodResolver(FormSchema),
  });

  const session = useSession();
  const router = useRouter();

  const [error, setError] = useState<null | string>(null);

  const createUserMutation = useMutation({
    mutationFn: (username: string) => {
      if (!session.data) {
        return Promise.reject('data is empty');
      }

      return createOAuthUser({
        email: session.data?.user.email,
        firstName: session.data.user.name.split(' ')[0],
        lastName: session.data.user.name.split(' ')[1],
        image: session.data.user.image || undefined,
        username: username,
      });
    },
    onError: (e: { response: { data: { message: string } } }) => {
      setError(e.response.data.message);
    },
    onSuccess: async () => {
      await fetch('/api/auth/session');
      router.push('/');
    },
  });

  if (session.status === 'loading') {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-[#0f1923]">
        <ClipLoader color="#008cff" speedMultiplier={0.7} size={130} />
      </div>
    );
  }

  if (session.status === 'unauthenticated') {
    router.push('/');
    return null;
  }

  if (!session.data?.user) {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center gap-4 bg-[#0f1923] text-[#ff5f5f]">
        <p className="text-xl font-medium">Something went wrong</p>
        <p className="text-white/50">Unable to retrieve user session</p>
      </div>
    );
  }

  function onSubmit(data: Input) {
    createUserMutation.mutate(data.username);
  }

  return (
    <AuthCard title="Choose Username">
      <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
        <div>
          <FormInput
            id="username"
            label="Username"
            {...register('username')}
            placeholder="Choose a username"
            icon={<User />}
            required
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: 0.1,
              type: 'spring',
              stiffness: 100,
              damping: 12,
            }}
          />
        </div>
        {errors.username && (
          <p className="mt-1 text-sm text-[#ff5f5f]">
            {errors.username.message}
          </p>
        )}
        {error && <p className="mt-1 text-sm text-[#ff5f5f]">{error}</p>}
        <GlowingButton type="submit" fullWidth>
          CONTINUE
        </GlowingButton>
      </form>
    </AuthCard>
  );
}
