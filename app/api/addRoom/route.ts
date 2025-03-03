import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getApiKey } from "@/utils/apiKeys";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { key, name, roomNumber, capacity, features, notes } =
      await req.json();

    if (key === getApiKey("admin")) {
      // Create a new room in the database
      const newRoom = await prisma.room.create({
        data: {
          name,
          number: parseInt(roomNumber),
          capacity: parseInt(capacity),
          features: features.length > 0 ? features.join(",") : null,
          // @ts-ignore
          notes: notes || null,
        },
      });

      return NextResponse.json(newRoom, { status: 201 });
    } else {
      return NextResponse.json(
        { error: "API Key not provided!" },
        { status: 500 },
      );
    }
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create room" },
      { status: 500 },
    );
  }
}
