import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

import { validateApiKey } from "@/lib/apiKeys";

const prisma = new PrismaClient();

export async function POST(
  req: Request,
  { params }: { params: { id: string } },
) {
  try {
    const formData = await req.formData();
    const key = formData.get("key") as string;

    if (!validateApiKey(key)) {
      return NextResponse.json({ error: "Invalid API Key!" }, { status: 403 });
    }

    const scheduleId = parseInt(params.id);

    const deletedSchedule = await prisma.booking.delete({
      where: { id: scheduleId },
    });

    return NextResponse.json(
      { message: `Schedule with ID ${scheduleId} successfully deleted.` },
      { status: 200 },
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        error: `Failed to delete schedule with ID ${params.id}: ${error.message}`,
      },
      { status: 500 },
    );
  }
}
