import RoomContainer from "./_components/RoomContainer";
import SearchFilterBar from "./_components/SearchFilterBar";

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

const page = async ({ searchParams }: PageProps) => {
  const params = await searchParams;
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <SearchFilterBar />
      <RoomContainer searchParams={params} />
    </div>
  );
};

export default page;
