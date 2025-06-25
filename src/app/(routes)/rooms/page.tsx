import RoomContainer from "./_components/RoomContainer";
import SearchFilterBar from "./_components/SearchFilterBar";

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

const page = async ({ searchParams }: PageProps) => {
  const params = await searchParams;
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2 text-neutral-100">Explore All Rooms</h1>
      <p className="text-neutral-300 mb-6">This page lists all possible rooms you can obtain.</p>
      <SearchFilterBar />
      <RoomContainer searchParams={params} />
    </div>
  );
};

export default page;
