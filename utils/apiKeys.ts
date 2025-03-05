export const getApiKey = async (keyName: string) => {
    try {
        const res = await fetch(`http://localhost:3000/api/getApiKey?keyName=${keyName}`);

        if (!res.ok) {
            throw new Error("API key not found");
        }

        const data = await res.json();
        return data.key;
    } catch (error) {
        console.error("Error fetching API key:", error);
        return null;
    }
};
