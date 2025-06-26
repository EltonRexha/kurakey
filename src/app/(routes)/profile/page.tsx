import React, { Suspense } from "react";
import ProfileSidebar from "./_components/ProfileSidebar";
import ChestGridWrapper from "./_components/ChestGridWrapper";
import RoomGridWrapper from "./_components/RoomGridWrapper";
import ChestGridSkeleton from "./_components/ChestGridSkeleton";
import RoomGridSkeleton from "./_components/RoomGridSkeleton";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import prisma from "../../../../prisma/prisma";
import { redirect } from "next/navigation";

interface PageProps {
  searchParams: { id?: string };
}

const page = async ({ searchParams }: PageProps) => {
  // Ensure user is authenticated
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    redirect("/log-in");
  }

  // Determine which profile to show
  const userId = searchParams.id ?? session.user.id;
  const isLoggedUser = userId === session.user.id;
  if (!searchParams.id) {
    redirect(`/profile?id=${userId}`);
  }

  // Fetch user data from database
  const dbUser = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      achievements: true,
    },
  });

  if (!dbUser) {
    redirect("/not-found");
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-[350px_1fr] gap-8">
      <ProfileSidebar
        username={dbUser.username}
        imageUrl={dbUser.image ?? "/placeholder-avatar.png"}
        xp={dbUser.xp}
        achievements={dbUser.achievements.map((a) => a.image)}
        joined={dbUser.createdAt.toISOString()}
        isLoggedUser={isLoggedUser}
      />
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
