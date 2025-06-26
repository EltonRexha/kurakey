"use client";
import { useEffect, useState } from "react";
import ChestCard from "./ChestCard";

interface ChestGridProps {
  chests: { id: string; name: string; count: number }[];
}

const ChestGrid: React.FC<ChestGridProps> = ({ chests }) => {
  const [cols, setCols] = useState(2);

  useEffect(() => {
    const calcCols = () => {
      const w = window.innerWidth;
      if (w < 640) return 2; // mobile
      if (w < 768) return 3; // sm
      if (w < 1024) return 4; // md
      return 5; // lg+
    };
    const handleResize = () => setCols(calcCols());
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const placeholders = (cols - (chests.length % cols)) % cols;

  return (
    <section className="mb-6">
      <h3 className="text-lg font-semibold text-neutral-100 mb-2">Chests</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
        {chests.length === 0 &&
          Array.from({ length: cols }).map((_, i) => (
            <div
              key={`ph-${i}`}
              className="aspect-square w-full border border-[#11142d] bg-[#0d1024]/50 rounded-md"
            />
          ))}
        {chests.map((c) => (
          <div key={c.id} className="aspect-square w-full">
            <ChestCard name={c.name} count={c.count} />
          </div>
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

export default ChestGrid;
