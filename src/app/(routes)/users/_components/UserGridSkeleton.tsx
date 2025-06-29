'use client';

const UserCardSkeleton = () => (
  <div className="w-full sm:w-[250px] bg-[#11142d] rounded-lg overflow-hidden animate-pulse">
    <div className="flex flex-col items-center p-4">
      <div className="w-24 h-24 mb-3 rounded-full bg-[#23224a]" />
      <div className="h-4 w-1/2 bg-[#23224a] rounded mb-2" />
      <div className="h-3 w-3/4 bg-[#23224a] rounded" />
    </div>
  </div>
);

const UserGridSkeleton = () => {
  const placeholders = Array.from({ length: 8 });
  return (
    <div className="flex flex-wrap gap-4">
      {placeholders.map((_, idx) => (
        <UserCardSkeleton key={idx} />
      ))}
    </div>
  );
};

export default UserGridSkeleton;
