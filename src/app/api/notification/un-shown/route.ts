import { NextResponse } from "next/server";
import GetServerUser from "../../../../../libs/GetServerUser";
import prisma from "../../../../../prisma/prisma";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function GET(request: Request) {
  const user = await GetServerUser();

  if (!user) {
    return NextResponse.json(
      { message: "you must login to view notifications" },
      { status: 401 }
    );
  }

  const unShownNotifications = await prisma.notification.findMany({
    where: {
      user: {
        id: user.id,
      },
      shown: false,
    },
    include: {
      chestType: {
        select: {
          name: true,
        },
      },
      room: {
        select: {
          previewImageUrl: true,
          name: true,
        },
      },
    },
  });

  return NextResponse.json(unShownNotifications, { status: 200 });
}
