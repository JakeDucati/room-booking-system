import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { roomNumber, startTime, endTime, event, host, scheduler } =
      await req.json();

    if (
      !roomNumber ||
      !startTime ||
      !endTime ||
      !event ||
      !host ||
      !scheduler
    ) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 },
      );
    }

    const room = await prisma.room.findUnique({
      where: { number: roomNumber },
      select: { id: true },
    });

    if (!room) {
      return NextResponse.json(
        { error: "Room does not exist" },
        { status: 404 },
      );
    }

    const roomId = room.id;

    const startUTC = new Date(startTime).toISOString();
    const endUTC = new Date(endTime).toISOString();

    if (new Date(startUTC) >= new Date(endUTC)) {
      return NextResponse.json(
        { error: "Start time must be before end time" },
        { status: 400 },
      );
    }

    const existingBooking = await prisma.booking.findFirst({
      where: {
        roomId,
        OR: [{ startTime: { lt: endUTC }, endTime: { gt: startUTC } }],
      },
    });

    if (existingBooking) {
      return NextResponse.json(
        { error: "Room is already booked for the selected time" },
        { status: 409 },
      );
    }

    const newBooking = await prisma.booking.create({
      data: {
        roomId,
        startTime: startUTC,
        endTime: endUTC,
        // @ts-ignore
        event,
        host,
        scheduler,
      },
    });

    return NextResponse.json(newBooking, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create booking" },
      { status: 500 },
    );
  }
}
