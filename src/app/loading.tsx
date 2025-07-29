import { Loader2 } from 'lucide-react';
import Image from 'next/image';

const Loader = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#191838] overscroll-none overflow-hidden">
      <Image
        src="/logo.webp"
        alt="Kurakey Logo"
        width={120}
        height={120}
        sizes="(max-width: 768px) 80px, 120px"
        quality={10}
        priority
      />
      <div className="mt-4 flex items-center justify-center">
        <Loader2 className="animate-spin text-[#008cff]" size={100} />
      </div>
      {/* This is here as a indicator */}
      <div className="hidden" id="loading"></div>
    </div>
  );
};

export default Loader;
