"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { useDebounce } from "@uidotdev/usehooks";

const filterOptions = [
  { value: "common_to_rare", label: "Common → Rare" },
  { value: "rare_to_common", label: "Rare → Common" },
];

const SearchFilterBar = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [room, setRoom] = useState<string>(searchParams.get("room") || "");
  const [filter, setFilter] = useState<string>(
    searchParams.get("filter") || "common_to_rare"
  );
  const debouncedRoom = useDebounce(room, 1000);

  useEffect(() => {
    const params = new URLSearchParams();
    if (debouncedRoom) params.set("room", debouncedRoom);
    if (filter) params.set("filter", filter);
    router.push(`/rooms?${params.toString()}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedRoom, filter]);

  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6">
      <input
        type="text"
        placeholder="Search room by name..."
        value={room}
        onChange={(e) => setRoom(e.target.value)}
        className="flex-1 px-3 py-2 rounded bg-[#11142d] text-white placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-emerald-500"
      />
      <select
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        className="w-48 px-3 py-2 rounded bg-[#11142d] text-white outline-none focus:ring-2 focus:ring-emerald-500 border-r-4 border-[#11142d]"
      >
        {filterOptions.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SearchFilterBar;
