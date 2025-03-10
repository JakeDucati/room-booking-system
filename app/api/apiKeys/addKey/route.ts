import fs from "fs/promises";
import path from "path";
import crypto from "crypto";

import { NextResponse } from "next/server";

import { validateApiKey } from "@/lib/apiKeys";

const API_KEYS_PATH = path.join(process.cwd(), "api-keys.json");

export async function POST(req: any) {
  try {
    const { key, keyName } = await req.json();

    if (!validateApiKey(key)) {
      return NextResponse.json({ error: "Invalid API Key!" }, { status: 403 });
    }

    if (!keyName || keyName.trim() === "") {
      return NextResponse.json(
        { error: "Key name is required!" },
        { status: 400 },
      );
    }

    const newApiKey = crypto.randomBytes(64).toString("hex");
    const data = await fs.readFile(API_KEYS_PATH, "utf-8");
    const apiKeys = JSON.parse(data);

    apiKeys[keyName] = newApiKey;

    await fs.writeFile(API_KEYS_PATH, JSON.stringify(apiKeys, null, 2));

    return NextResponse.json({ message: "Added new API key", key: newApiKey });
  } catch (error) {
    console.error("Error adding API key:", error);

    return NextResponse.json(
      { error: "Failed to add API key" },
      { status: 500 },
    );
  }
}
