import fs from "fs";
import path from "path";

const filePath = path.join(process.cwd(), "api-keys.json");

export const getApiKeys = (): Record<string, string> => {
  try {
    const data = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Failed to read API keys:", error);
    return {};
  }
};
