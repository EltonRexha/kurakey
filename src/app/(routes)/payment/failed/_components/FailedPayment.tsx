'use client';

import { motion } from 'framer-motion';
import { XCircle } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export interface FailedPaymentProps {
  product: {
    name: string;
    image: string;
    type: 'bundle' | 'coin';
  } | null;
}

export default function FailedPayment({ product }: FailedPaymentProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[100vh] px-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="bg-[#191838] border border-[#ff4d4f] rounded-xl p-8 shadow-lg max-w-md w-full"
      >
        <div className="flex flex-col items-center text-center">
          <XCircle
            className="text-[#ff4d4f] w-16 h-16 mb-4"
            strokeWidth={1.2}
          />
          <h1 className="text-2xl font-bold text-neutral-100 mb-2">
            Payment Failed
          </h1>
          <p className="text-neutral-300 mb-4">
            Unfortunately, your payment did not go through. You have{' '}
            <span className="font-semibold text-neutral-100">not</span> been
            charged. If you need help, please{' '}
            <Link href="/support" className="text-sky-400 hover:underline">
              contact our support
            </Link>
            .
          </p>

          {product && (
            <motion.div
              initial={{ y: 15, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="flex flex-col items-center mb-6"
            >
              <div className="relative h-40 w-40 mb-3">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  sizes="160px"
                  className="object-contain"
                />
              </div>
              <p className="text-lg font-semibold text-neutral-100">
                {product.name} {product.type === 'coin' ? 'Package' : ''}
              </p>
            </motion.div>
          )}

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => (window.location.href = '/')}
            className="w-full bg-[#008cff] text-white font-semibold py-2 rounded-lg hover:bg-[#009dff] transition-color cursor-pointer"
          >
            Go Home
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
