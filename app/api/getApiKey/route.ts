import { NextResponse } from "next/server";
import { getApiKeys } from "@/utils/getApiKeys";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const keyName = searchParams.get("keyName");

    if (!keyName) {
        return NextResponse.json({ error: "Missing keyName parameter" }, { status: 400 });
    }

    const apiKeys = getApiKeys();
    const apiKey = apiKeys[keyName];

    if (!apiKey) {
        return NextResponse.json({ error: "API key not found" }, { status: 404 });
    }

    return NextResponse.json({ key: apiKey }, { status: 200 });
}
