export default function ProfileSidebarSkeleton() {
  // Simple skeleton matching the sidebar layout
  const badgePlaceholders = Array.from({ length: 4 });
  return (
    <aside className="w-full bg-[#191838] border border-[#11142d] rounded-xl p-4 flex flex-col items-center h-max animate-pulse">
      <div className="relative w-24 h-24 rounded-full overflow-hidden ring-4 ring-[#008cff]/50 mb-3 bg-[#0d1024]/50" />
      <div className="h-5 w-32 bg-[#11142d] rounded mb-3" />
      {/* Level bar placeholder */}
      <div className="w-full h-6 bg-[#0d1024]/50 rounded mb-4" />
      {/* Achievements grid placeholder */}
      <div className="grid grid-cols-4 gap-2 w-full mt-2">
        {badgePlaceholders.map((_, i) => (
          <div key={i} className="aspect-square w-full bg-[#0d1024]/50 border border-[#11142d] rounded-md" />
        ))}
      </div>
      <div className="h-4 w-24 bg-[#11142d] rounded mt-4" />
    </aside>
  );
}
