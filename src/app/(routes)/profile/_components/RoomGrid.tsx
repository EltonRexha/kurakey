"use client";
import RoomCard from "./RoomCard";
import { RoomCategory } from "@/generated/prisma";
import Link from "next/link";
import { useEffect, useState } from "react";

interface RoomGridProps {
  rooms: {
    id: string;
    name: string;
    image: string;
    rarity: string;
    category: RoomCategory;
    count: number;
  }[];
}

const RoomGrid: React.FC<RoomGridProps> = ({ rooms }) => {
  const [cols, setCols] = useState(2);
  useEffect(() => {
    const calcCols = () => {
      const w = window.innerWidth;
      if (w < 640) return 2;
      if (w < 768) return 3;
      if (w < 1024) return 4;
      return 5;
    };
    const handleResize = () => setCols(calcCols());
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  const placeholders = (cols - (rooms.length % cols)) % cols;
  return (
    <section className="mb-6">
      <h3 className="text-lg font-semibold text-neutral-100 mb-2">Rooms</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
        {rooms.length === 0 &&
          Array.from({ length: cols }).map((_, i) => (
            <div
              key={`ph-${i}`}
              className="aspect-square w-full border border-[#11142d] bg-[#0d1024]/50 rounded-md"
            />
          ))}
        {rooms.map((room) => (
          <Link key={room.id} href={`/room?id=${room.id}`}>
            <div className="aspect-square w-full">
              <RoomCard {...room} />
            </div>
          </Link>
        ))}
        {Array.from({ length: placeholders }).map((_, i) => (
          <div
            key={`ph-${i}`}
            className="aspect-square w-full border border-[#11142d] bg-[#0d1024]/50 rounded-md"
          />
        ))}
      </div>
    </section>
  );
};

export default RoomGrid;
