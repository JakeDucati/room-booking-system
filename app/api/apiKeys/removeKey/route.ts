import fs from "fs/promises";
import path from "path";

import { NextResponse } from "next/server";

import { validateApiKey } from "@/lib/apiKeys";

const API_KEYS_PATH = path.join(process.cwd(), "api-keys.json");

export async function POST(req: Request) {
  try {
    const { key, keyName } = await req.json();

    if (!validateApiKey(key)) {
      return NextResponse.json({ error: "Invalid API Key!" }, { status: 403 });
    }

    const data = await fs.readFile(API_KEYS_PATH, "utf-8");
    const apiKeys = JSON.parse(data);

    if (!apiKeys[keyName]) {
      return NextResponse.json(
        { error: "API key not found!" },
        { status: 404 },
      );
    }

    delete apiKeys[keyName];

    await fs.writeFile(API_KEYS_PATH, JSON.stringify(apiKeys, null, 2));

    return NextResponse.json({ message: "API key deleted successfully" });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete API key" },
      { status: 500 },
    );
  }
}
