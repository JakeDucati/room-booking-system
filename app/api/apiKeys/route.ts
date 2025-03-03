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

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const keyName = searchParams.get("keyName");

    if (!keyName) {
        return new Response(
            JSON.stringify({ error: "Missing keyName parameter" }),
            { status: 400 }
        );
    }

    const apiKeys = getApiKeys();
    const apiKey = apiKeys[keyName];

    if (apiKey) {
        return new Response(JSON.stringify({ key: apiKey }), { status: 200 });
    } else {
        return new Response(
            JSON.stringify({ error: "API key not found" }),
            { status: 404 }
        );
    }
}
