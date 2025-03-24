import { writeFile } from "fs/promises";
import path from "path";

import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import mime from "mime";

import { validateApiKey } from "@/lib/apiKeys";

const prisma = new PrismaClient();
const PUBLIC_ROOMS_DIR = path.join(process.cwd(), "public", "rooms");

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const key = formData.get("key") as string;
    const name = formData.get("name") as string;
    const roomNumber = formData.get("roomNumber") as string;
    const capacity = formData.get("capacity") as string;
    const features = JSON.parse((formData.get("features") as string) || "[]");
    const notes = (formData.get("notes") as string) || null;
    const image = formData.get("image") as File | null;
    const status = "free";

    if (!validateApiKey(key)) {
      return NextResponse.json({ error: "Invalid API Key!" }, { status: 403 });
    }

    let imagePath = null;

    if (image) {
      const allowedTypes = [
        "image/png",
        "image/jpeg",
        "image/gif",
        "image/webp",
      ];

      if (!allowedTypes.includes(image.type)) {
        return NextResponse.json(
          { error: "Invalid image format" },
          { status: 400 },
        );
      }

      const extension = mime.getExtension(image.type);

      imagePath = `/rooms/${roomNumber}.${extension}`;
      const filePath = path.join(
        PUBLIC_ROOMS_DIR,
        `${roomNumber}.${extension}`,
      );

      const buffer = Buffer.from(await image.arrayBuffer());

      // @ts-ignore
      await writeFile(filePath, buffer);
    }

    const newRoom = await prisma.$transaction(async (prisma) => {
      return await prisma.room.create({
        data: {
          name,
          number: parseInt(roomNumber),
          capacity: parseInt(capacity),
          features: features.length > 0 ? features.join(",") : null,
          notes,
          image: imagePath,
          // @ts-ignore
          status,
        },
      });
    });

    return NextResponse.json(newRoom, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create room" },
      { status: 500 },
    );
  }
}
