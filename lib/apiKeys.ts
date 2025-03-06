"use server"

import fs from "fs";
import path from "path";

const apiKeysPath = path.join(process.cwd(), "api-keys.json");

const readApiKeys = (): Record<string, string> => {
    const data = fs.readFileSync(apiKeysPath, "utf-8");
    return JSON.parse(data);
};

export const getApiKey = (keyName: string): string | null => {
    const apiKeys = readApiKeys();
    return apiKeys[keyName] || null;
};

export const validateApiKey = (key: string): boolean => {
    const apiKeys = readApiKeys();
    return Object.values(apiKeys).includes(key);
};
