import React, { Suspense } from "react";
import ProfileSidebarWrapper from "./_components/ProfileSidebarWrapper";
import ChestGridWrapper from "./_components/ChestGridWrapper";
import RoomGridWrapper from "./_components/RoomGridWrapper";
import ProfileSidebarSkeleton from "./_components/ProfileSidebarSkeleton";
import ChestGridSkeleton from "./_components/ChestGridSkeleton";
import RoomGridSkeleton from "./_components/RoomGridSkeleton";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";

import { redirect } from "next/navigation";

interface PageProps {
  searchParams: Promise<{ id?: string }>;
}

const page = async ({ searchParams }: PageProps) => {
  // Ensure user is authenticated
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    redirect("/log-in");
  }

  const params = await searchParams;

  // Determine which profile to show
  const userId = params.id ?? session.user.id;
  if (!params.id) {
    redirect(`/profile?id=${userId}`);
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-[350px_1fr] gap-8">
      <Suspense fallback={<ProfileSidebarSkeleton />}>
        <ProfileSidebarWrapper userId={userId} />
      </Suspense>
      <div className="lg:max-h-[calc(100vh-200px)] overflow-y-auto p-2">
        <Suspense fallback={<ChestGridSkeleton />}>
          <ChestGridWrapper userId={userId} />
        </Suspense>
        <Suspense fallback={<RoomGridSkeleton />}>
          <RoomGridWrapper userId={userId} />
        </Suspense>
      </div>
    </div>
  );
};

export default page;
