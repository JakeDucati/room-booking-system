import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

import { validateApiKey } from "@/lib/apiKeys";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const key = formData.get("key") as string;
    const roomId = parseInt(formData.get("id") as string);

    if (!validateApiKey(key)) {
      return NextResponse.json({ error: "Invalid API Key!" }, { status: 403 });
    }

    if (isNaN(roomId)) {
      return NextResponse.json({ error: "Invalid Room ID" }, { status: 400 });
    }

    const room = await prisma.room.findUnique({
      where: { id: roomId },
    });

    if (!room) {
      return NextResponse.json({ error: "Room not found" }, { status: 404 });
    }

    await prisma.$transaction([
      prisma.booking.deleteMany({
        where: { roomId },
      }),
      prisma.room.delete({
        where: { id: roomId },
      }),
    ]);

    return NextResponse.json(
      {
        message: `Room ${room.number} and all associated bookings deleted successfully`,
      },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete room and associated bookings" },
      { status: 500 },
    );
  }
}
