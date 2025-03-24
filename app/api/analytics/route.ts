import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: Request) {
  const url = new URL(request.url);
  const roomId = url.searchParams.get("roomId");
  const allRooms = url.searchParams.get("all");

  try {
    const startOfMonth = new Date();

    startOfMonth.setMonth(startOfMonth.getMonth());
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const endOfMonth = new Date();

    endOfMonth.setHours(23, 59, 59, 999);

    let bookings;

    if (allRooms === "true") {
      bookings = await prisma.booking.findMany({
        where: {
          startTime: {
            gte: startOfMonth,
            lte: endOfMonth,
          },
        },
      });
    } else if (roomId) {
      bookings = await prisma.booking.findMany({
        where: {
          roomId: parseInt(roomId),
          startTime: {
            gte: startOfMonth,
            lte: endOfMonth,
          },
        },
      });
    } else {
      return new Response(
        JSON.stringify({ error: "Room ID or 'all' parameter is required" }),
        {
          status: 400,
        },
      );
    }

    return new Response(JSON.stringify(bookings), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Failed to fetch bookings" }), {
      status: 500,
    });
  }
}
