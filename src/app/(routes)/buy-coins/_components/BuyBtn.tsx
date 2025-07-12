'use client';
import ShineButton from '@/components/ui/common/ShineButton';
import { useMutation } from '@tanstack/react-query';
import React from 'react';
import { createStripeCheckoutSessionCoinPackage } from '../../../../../libs/api/stripe';
import { getStripe } from '../../../../../libs/stripe/stripe-client';

const BuyBtn = ({ coinPackageId }: { coinPackageId: string }) => {
  const createCheckoutSessionMutation = useMutation({
    mutationFn: createStripeCheckoutSessionCoinPackage,
  });

  const handleBuyCoin = async (coinPackageId: string) => {
    const { checkoutSessionId } =
      await createCheckoutSessionMutation.mutateAsync(coinPackageId);

    const stripe = await getStripe();
    await stripe?.redirectToCheckout({
      sessionId: checkoutSessionId,
    });
  };
  return (
    <ShineButton onClick={() => handleBuyCoin(coinPackageId)}>BUY</ShineButton>
  );
};

export default BuyBtn;
