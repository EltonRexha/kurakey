import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../../../prisma/prisma";
import GetServerUser from "../../../../../libs/GetServerUser";

export async function POST(req: NextRequest) {
  const { id } = await req.json();
  if (!id) {
    return NextResponse.json(
      { error: "Missing notification id" },
      { status: 400 }
    );
  }

  const user = await GetServerUser();

  if (!user) {
    return NextResponse.json(
      { error: "You need to login to mark as read" },
      { status: 401 }
    );
  }

  await prisma.notification.update({
    where: { id },
    data: { isRead: true },
  });
  return NextResponse.json({ success: true });
}
