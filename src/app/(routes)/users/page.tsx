import SearchUserBar from './_components/SearchUserBar';
import UsersWrapper from './_components/UsersWrapper';
import UserGridSkeleton from './_components/UserGridSkeleton';
import { Suspense } from 'react';

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

const page = async ({ searchParams }: PageProps) => {
  const params = await searchParams;
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2 text-neutral-100">
        Explore Users
      </h1>
      <p className="text-neutral-300 mb-6">
        Find other collectors to trade rooms & chests with.
      </p>
      <SearchUserBar />
      <Suspense fallback={<UserGridSkeleton />}>
        <UsersWrapper searchParams={params} />
      </Suspense>
    </div>
  );
};

export default page;
