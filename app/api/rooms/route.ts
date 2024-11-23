export async function GET(req: Request) {
    const rooms = [
        {
            roomNumber: 1412,
            status: 'busy',
            start: '2024-11-23T08:00:00',
            end: '2024-11-23T10:00:00',
            host: 'John Doe',
        },
        {
            roomNumber: 1420,
            status: 'free',
            start: '2024-11-23T09:00:00',
            end: '2024-11-23T11:00:00',
            host: 'Jane Smith',
        },
    ];

    return new Response(JSON.stringify(rooms), {
        headers: { 'Content-Type': 'application/json' },
    });
}
