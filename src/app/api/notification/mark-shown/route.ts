import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../../../prisma/prisma";
import GetServerUser from "../../../../../libs/GetServerUser";

export async function POST(request: NextRequest) {
  const { id } = await request.json();
  if (!id) {
    return NextResponse.json(
      { error: "Missing notification id" },
      { status: 400 }
    );
  }

  const user = await GetServerUser();

  if (!user) {
    return NextResponse.json(
      { error: "You need to login to mark as shown" },
      { status: 401 }
    );
  }

  await prisma.notification.update({
    where: { id },
    data: { shown: true },
  });

  return NextResponse.json({ success: true });
}
