import fs from "fs/promises";
import path from "path";

import { NextResponse } from "next/server";

import { validateApiKey } from "@/lib/apiKeys";

const API_KEYS_PATH = path.join(process.cwd(), "api-keys.json");

export async function POST(req: any) {
  try {
    const { key } = await req.json();

    if (!validateApiKey(key)) {
      return NextResponse.json({ error: "Invalid API Key!" }, { status: 403 });
    }

    const data = await fs.readFile(API_KEYS_PATH, "utf-8");
    const apiKeys = JSON.parse(data);

    const keysArray = Object.entries(apiKeys).map(([keyName, apiKey]) => ({
      keyName,
      apiKey,
    }));

    return NextResponse.json({ keys: keysArray });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to retrieve API keys" },
      { status: 500 },
    );
  }
}
