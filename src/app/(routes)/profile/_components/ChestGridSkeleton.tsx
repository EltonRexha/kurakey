export default function ChestGridSkeleton() {
  const placeholders = Array.from({ length: 10 });
  return (
    <section className="mb-6 animate-pulse">
      <div className="h-5 w-24 bg-[#11142d] rounded mb-4" />
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
        {placeholders.map((_, i) => (
          <div key={i} className="aspect-square w-full bg-[#0d1024]/50 border border-[#11142d] rounded-md" />
        ))}
      </div>
    </section>
  );
}
