import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";

const prisma = new PrismaClient();
const filePath = path.join(process.cwd(), "api-keys.json");

const getApiKeys = (): Record<string, string> => {
  try {
    const data = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Failed to read API keys:", error);
    return {};
  }
};

export async function POST(req: Request) {
  try {
    const { key, name, roomNumber, capacity, features, notes } = await req.json();
    const apiKeys = getApiKeys();

    if (!Object.values(apiKeys).includes(key)) {
      return NextResponse.json({ error: "Invalid API Key!" }, { status: 403 });
    }

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
  } catch (error) {
    return NextResponse.json({ error: "Failed to create room" }, { status: 500 });
  }
}
