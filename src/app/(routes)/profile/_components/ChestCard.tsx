"use client";
import Image from "next/image";
import Link from "next/link";

interface ChestCardProps {
  name: string;
  count: number;
  countMessage?: string;
  chestImageUrl: string;
}

const ChestCard: React.FC<ChestCardProps> = ({
  name,
  count,
  countMessage,
  chestImageUrl,
}) => {
  return (
    <Link href={`/chest/${name}`} className="w-full h-full">
    <div className="relative w-full h-full bg-[#0d1024] border border-[#11142d] group rounded-md overflow-hidden flex flex-col items-center justify-center">
      {/* Image */}
      <div className="absolute inset-0 flex items-center group-hover:scale-105 transition-transform duration-200 justify-center p-2 mb-10">
        <Image
          src={chestImageUrl}
          alt={name}
          fill
          className="object-contain"
        />
      </div>
      {count > 1 && (
        <span className="absolute top-1 right-1 bg-[#008cff] text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
          {countMessage ? countMessage : ''} {count}x
        </span>
      )}
      {/* Name */}
      <div className="absolute bottom-0 left-0 right-0 bg-[#18173a]/80 py-1 text-center text-xs font-semibold text-neutral-100 truncate px-1">
        {name}
      </div>
    </div>
    </Link>
  );
};

export default ChestCard;
