'use client';
import { AuthCard, FormInput } from '@/components/ui/auth';
import { GlowingButton } from '@/components/ui/common';
import { User } from 'lucide-react';
import React from 'react';

export default function FinishAuthPage() {
  return (
    <AuthCard title="Choose Username">
      <form className="space-y-6">
        <div>
          <FormInput
            id="username"
            label="Username"
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
        <GlowingButton type="submit" fullWidth>
          CONTINUE
        </GlowingButton>
      </form>
    </AuthCard>
  );
}
