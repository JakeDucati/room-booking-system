import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const roomId = searchParams.get("roomId");

  try {
    const bookings = await prisma.booking.findMany({
      where: roomId ? { roomId: Number(roomId) } : {},
      orderBy: { startTime: "asc" },
    });

    return NextResponse.json(bookings);
  } catch (error) {
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
