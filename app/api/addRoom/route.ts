import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

import { validateApiKey } from "@/lib/apiKeys";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { key, name, roomNumber, capacity, features, notes } =
      await req.json();

    if (validateApiKey(key)) {
      const newRoom = await prisma.room.create({
        data: {
          name,
          number: parseInt(roomNumber),
          capacity: parseInt(capacity),
          features: features.length > 0 ? features.join(",") : null,
          notes: notes || null,
        },
      });

      return NextResponse.json(newRoom, { status: 201 });
    } else {
      return NextResponse.json({ error: "Invalid API Key!" }, { status: 403 });
    }
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create room" },
      { status: 500 },
    );
  }
}
