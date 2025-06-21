'use client';
import { createPortal } from 'react-dom';
import Modal from './ui/Modal';
import useMounted from '@/hooks/useMounted';
import ShineButton from './ui/common/ShineButton';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import coinIcon from '@/assets/images/icons/coin.png';
import Image from 'next/image';
import { useMutation } from '@tanstack/react-query';
import { buyChest } from '../../libs/api/chests';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ClipLoader } from 'react-spinners';
import { useToastContext } from '@/context/ToastContext';
import { useItemNotification } from '@/context/ItemNotificationContext';

const MIN = 1;
const MAX = 100;

const schema = z.object({
  amount: z.coerce.number().min(MIN).max(MAX),
});

type FormData = z.infer<typeof schema>;

interface Props {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  price: number;
  userCoinBalance: number;
  chestId: string;
  chestName: string;
}

const BuyChestModal: React.FC<Props> = ({
  isOpen,
  setIsOpen,
  price,
  userCoinBalance,
  chestId,
  chestName,
}) => {
  const mounted = useMounted();
  const [loading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      amount: 1,
    },
  });

  const router = useRouter();
  const { addToast } = useToastContext();
  const { addChest, addXP } = useItemNotification();

  const buyChestMutation = useMutation({
    mutationFn: buyChest,
    onSuccess: ({ amount }) => {
      setIsLoading(false);
      if (amount > 1) {
        addChest(
          `${amount}x ${chestName} chests have been added to your inventory`,
          chestName
        );
      } else {
        addChest(
          `${chestName} chest has been added to your inventory`,
          chestName
        );
      }

      addXP(20 * amount);
      setIsOpen(false);
      router.refresh();
    },
    onError: () => {
      setIsLoading(false);
      addToast('Something wrong happened buying chests', 'error');
      setIsOpen(false);
      router.refresh();
    },
    onMutate: () => {
      setIsLoading(true);
    },
  });

  if (!mounted) {
    return null;
  }

  const modelElement = document.getElementById('modal')!;
  const totalPrice = watch('amount') * price;

  function onSubmit(data: FormData) {
    buyChestMutation.mutate({
      amount: data.amount,
      typeId: chestId,
    });
  }

  function incrementAmount(amount: number) {
    return () => {
      const currentAmount = Number(watch('amount'));
      let nextAmount = currentAmount + amount;
      if (nextAmount > MAX) {
        nextAmount = MAX;
      }
      if (nextAmount < MIN) {
        nextAmount = MIN;
      }
      setValue('amount', nextAmount);
    };
  }

  return (
    <>
      {createPortal(
        <Modal
          isOpen={isOpen}
          onClose={() => {
            setIsOpen(false);
          }}
          className="sm:w-max"
        >
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <div className="flex flex-col items-center gap-6">
              <label
                htmlFor="chest-amount"
                className="text-neutral-200 text-lg font-semibold mb-2"
              >
                Chest Purchase Amount
              </label>
              <input
                id="chest-amount"
                type="number"
                min={1}
                max={100}
                className="w-full text-center text-xl font-bold rounded-lg border border-[#23224a] bg-[#18173a] text-neutral-100 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-[#008cff] focus:shadow-[0_0_10px_#008cff66] hover:border-[#008cff] hover:shadow-[0_0_8px_#008cff55] transition-all duration-200"
                placeholder="1"
                {...register('amount')}
              />
              {errors.amount && (
                <p className="mt-1 text-sm text-[#ff5f5f]">
                  {errors.amount.message}
                </p>
              )}
              <div className="flex w-full">
                <div
                  className={`flex items-center justify-center w-full mt-2 text-emerald-400 ${
                    userCoinBalance < totalPrice ? 'text-red-500' : ''
                  }`}
                >
                  <p className="flex gap-2 items-center">
                    <span className="hidden sm:block">Total Price:</span>
                    <span className="block sm:hidden">Price:</span>
                    <span className="text-lg font-bold">{totalPrice}</span>
                  </p>
                  <Image
                    src={coinIcon}
                    alt="Coins"
                    width={24}
                    height={24}
                    className="object-contain inline-block align-middle ml-1"
                  />
                </div>
                <div className="flex items-center justify-center w-full mt-2 text-emerald-400">
                  <p className="flex gap-2 items-center">
                    <span>You have:</span>
                    <span className="text-lg font-bold">{userCoinBalance}</span>
                  </p>
                  <Image
                    src={coinIcon}
                    alt="Coins"
                    width={24}
                    height={24}
                    className="object-contain inline-block align-middle ml-1"
                  />
                </div>
              </div>

              <div className="flex gap-2 w-full mt-4 justify-center overflow-auto">
                <button
                  type="button"
                  className="px-4 py-2 rounded-lg bg-[#2a1a1a] text-[#ff4d4f] font-semibold text-base border border-[#ff4d4f] transition-all duration-200 hover:bg-[#ff4d4f] hover:text-white hover:shadow-[0_0_12px_#ff4d4f99] focus:outline-none focus:ring-2 focus:ring-[#ff4d4f] focus:shadow-[0_0_16px_#ff4d4fcc] active:scale-95 cursor-pointer"
                  onClick={incrementAmount(-20)}
                >
                  -20
                </button>
                <button
                  type="button"
                  className="px-4 py-2 rounded-lg bg-[#2a1a1a] text-[#ff4d4f] font-semibold text-base border border-[#ff4d4f] transition-all duration-200 hover:bg-[#ff4d4f] hover:text-white hover:shadow-[0_0_12px_#ff4d4f99] focus:outline-none focus:ring-2 focus:ring-[#ff4d4f] focus:shadow-[0_0_16px_#ff4d4fcc] active:scale-95 cursor-pointer"
                  onClick={incrementAmount(-5)}
                >
                  -5
                </button>
                <button
                  type="button"
                  className="px-4 py-2 rounded-lg bg-[#2a1a1a] text-[#ff4d4f] font-semibold text-base border border-[#ff4d4f] transition-all duration-200 hover:bg-[#ff4d4f] hover:text-white hover:shadow-[0_0_12px_#ff4d4f99] focus:outline-none focus:ring-2 focus:ring-[#ff4d4f] focus:shadow-[0_0_16px_#ff4d4fcc] active:scale-95 cursor-pointer"
                  onClick={incrementAmount(-1)}
                >
                  -1
                </button>
                <button
                  type="button"
                  className="px-4 py-2 rounded-lg bg-[#23224a] text-[#008cff] font-semibold text-base border border-[#008cff] transition-all duration-200 hover:bg-[#008cff] hover:text-white hover:shadow-[0_0_12px_#008cff99] focus:outline-none focus:ring-2 focus:ring-[#008cff] focus:shadow-[0_0_16px_#008cffcc] active:scale-95 cursor-pointer"
                  onClick={incrementAmount(1)}
                >
                  +1
                </button>
                <button
                  type="button"
                  className="px-4 py-2 rounded-lg bg-[#23224a] text-[#008cff] font-semibold text-base border border-[#008cff] transition-all duration-200 hover:bg-[#008cff] hover:text-white hover:shadow-[0_0_12px_#008cff99] focus:outline-none focus:ring-2 focus:ring-[#008cff] focus:shadow-[0_0_16px_#008cffcc] active:scale-95 cursor-pointer"
                  onClick={incrementAmount(5)}
                >
                  +5
                </button>
                <button
                  type="button"
                  className="px-4 py-2 rounded-lg bg-[#23224a] text-[#008cff] font-semibold text-base border border-[#008cff] transition-all duration-200 hover:bg-[#008cff] hover:text-white hover:shadow-[0_0_12px_#008cff99] focus:outline-none focus:ring-2 focus:ring-[#008cff] focus:shadow-[0_0_16px_#008cffcc] active:scale-95 cursor-pointer"
                  onClick={incrementAmount(20)}
                >
                  +20
                </button>
              </div>
              {userCoinBalance < totalPrice ? (
                <ShineButton type="submit" disabled>
                  {loading ? (
                    <span className="flex items-center justify-center w-full">
                      <ClipLoader
                        color="#fbbf24"
                        size={28}
                        speedMultiplier={0.9}
                      />
                    </span>
                  ) : (
                    'Buy'
                  )}
                </ShineButton>
              ) : (
                <ShineButton type="submit" disabled={loading}>
                  {loading ? (
                    <span className="flex items-center justify-center w-full">
                      <ClipLoader
                        color="#fbbf24"
                        size={28}
                        speedMultiplier={0.9}
                      />
                    </span>
                  ) : (
                    'Buy'
                  )}
                </ShineButton>
              )}
            </div>
          </form>
        </Modal>,
        modelElement
      )}
    </>
  );
};

export default BuyChestModal;
