'use client';
import ShineButton from '@/components/ui/common/ShineButton';
import { useMutation } from '@tanstack/react-query';
import React from 'react';
import { createStripeCheckoutSessionBundle } from '../../../../../libs/api/stripe';
import { getStripe } from '../../../../../libs/stripe/stripe-client';

const BuyBundleBtn = ({ bundleId }: { bundleId: string }) => {
  const createCheckoutSessionMutation = useMutation({
    mutationFn: createStripeCheckoutSessionBundle,
  });

  const handleBuyBundle = async () => {
    const { checkoutSessionId } =
      await createCheckoutSessionMutation.mutateAsync(bundleId);

    const stripe = await getStripe();
    await stripe?.redirectToCheckout({
      sessionId: checkoutSessionId,
    });
  };
  return <ShineButton onClick={() => handleBuyBundle()}>Buy</ShineButton>;
};

export default BuyBundleBtn;
