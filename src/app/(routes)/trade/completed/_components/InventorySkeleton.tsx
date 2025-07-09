'use client';


const InventorySkeleton: React.FC = () => {
    const placeholders = Array.from({ length: 12 });

    return (
        <div className="bg-[#0d1024]/30 border border-[#11142d] rounded-lg p-5 w-full animate-pulse">
            {/* Header skeleton */}
            <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-full bg-[#23224a]" />
                <div className="h-4 w-24 bg-[#23224a] rounded" />
            </div>

            <div className="grid gap-2 overflow-y-hidden h-[320px] grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-3 xl:grid-cols-4">
                {placeholders.map((_, i) => (
                    <div
                        key={i}
                        className="aspect-square w-full bg-[#0d1024]/50 border border-[#11142d] rounded-md"
                    />
                ))}
            </div>
        </div>
    );
};

export default InventorySkeleton; 