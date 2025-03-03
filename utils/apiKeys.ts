export const getApiKey = async (keyName: string) => {
    try {
        const res = await fetch(`/api/apiKeys?keyName=${keyName}`);
        if (res.ok) {
            const data = await res.json();
            return data.key;
        } else {
            throw new Error("API key not found");
        }
    } catch (error) {
        console.error(error);
        return null;
    }
};