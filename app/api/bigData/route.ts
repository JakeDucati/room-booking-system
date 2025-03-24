import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const totalRooms = await prisma.room.count();
    const totalSchedules = await prisma.booking.count();

    const currentlyScheduled = await prisma.room.count({
      where: {
        bookings: {
          some: {
            startTime: { lte: new Date() },
            endTime: { gte: new Date() },
          },
        },
      },
    });

    const currentlyFree = totalRooms - currentlyScheduled;
    const totalBuildingCapacity = await prisma.room.aggregate({
      _sum: { capacity: true },
    });

    return NextResponse.json({
      totalRooms,
      totalSchedules,
      currentlyScheduled,
      currentlyFree,
      totalBuildingCapacity: totalBuildingCapacity._sum.capacity || 0,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
