import StarsButton from '@/components/ui/StarsButton';
import { useMutation } from '@tanstack/react-query';
import React from 'react';
import { createTrade } from '../../../../../libs/api/trade';
import { useToastContext } from '@/context/ToastContext';
import { useRouter } from 'next/navigation';

interface Props {
  receiverId: string;
}

const TradeBtn = ({ receiverId }: Props) => {
  const { addToast } = useToastContext();
  const router = useRouter();

  const createTradeMutation = useMutation({
    mutationFn: createTrade,
    onError: (err: { response?: { data: { message?: string } } }) => {
      const msg = err.response?.data.message;
      if (msg) {
        addToast(msg, 'error');
      } else {
        addToast('Could not trade at the moment, try again later', 'error');
      }
    },
    onSuccess: (res) => {
      addToast(res.message, 'success');
      router.push(`/trade?id=${res.tradeId}`);
    },
  });

  return (
    <StarsButton
      className="w-full mt-4"
      onClick={() => {
        createTradeMutation.mutate({ receiverId });
      }}
    >
      Trade
    </StarsButton>
  );
};

export default TradeBtn;
