import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const roomId = searchParams.get("roomId");

    if (!roomId) {
        return NextResponse.json({ message: "Room ID is required" }, { status: 400 });
    }

    try {
        const bookings = await prisma.booking.findMany({
            where: { roomId: Number(roomId) },
            orderBy: { startTime: "asc" },
        });

        return NextResponse.json(bookings);
    } catch (error) {
        console.error("Error fetching bookings:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}
