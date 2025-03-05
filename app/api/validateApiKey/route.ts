import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

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
        const { key } = await req.json();
        const apiKeys = getApiKeys();

        if (!Object.values(apiKeys).includes(key)) {
            return NextResponse.json({ error: "Invalid API Key!" }, { status: 403 });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: "Error validating API key" }, { status: 500 });
    }
}
