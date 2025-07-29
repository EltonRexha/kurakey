// PreloadProvider.tsx
// Responsible for pre-loading critical asset images (rooms, chests, bundles, coin-packages).
// It renders a screen-wide loader until all provided images fire `onload`/`onerror`, then unmounts the overlay.
'use client';

import React, { useEffect, useState, ReactNode } from 'react';
import Image from 'next/image';
import { Loader2 } from 'lucide-react';

interface Props {
  images: string[];
  children: ReactNode;
}

export default function PreloadProvider({ images, children }: Props) {
  const [done, setDone] = useState(false);

  // Lock scroll while overlay is active
  useEffect(() => {
    const original = document.body.style.overflow;
    if (!done) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = original;
    }
    return () => {
      document.body.style.overflow = original;
    };
  }, [done]);

  useEffect(() => {
    if (!images.length) {
      setDone(true);
      return;
    }

    let loaded = 0;
    const handle = () => {
      loaded += 1;
      if (loaded === images.length) setDone(true);
    };

    images.forEach((src) => {
      const img = new window.Image();
      img.onload = handle;
      img.onerror = handle;
      // Use Cloudinary transformation for smallest placeholder; the full asset will be cached.
      img.src = src;
    });
  }, [images]);

  return (
    <>
      {!done && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#191838]">
          <Image
            src="/logo.png"
            alt="Kurakey Logo"
            width={120}
            height={120}
            sizes="(max-width: 768px) 80px, 120px"
            quality={30}
            priority
          />
          <div className="mt-4 flex items-center justify-center">
            <Loader2 className="animate-spin text-[#008cff]" size={100} />
          </div>
        </div>
      )}
      {/* `invisible` while loading to keep layout calculations consistent */}
      <div className={done ? '' : 'invisible'}>{children}</div>
    </>
  );
}
