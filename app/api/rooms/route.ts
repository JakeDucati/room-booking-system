export async function GET() {
  const rooms = [
    {
      roomNumber: 1412,
      status: "busy",
      event: "Software Development Introduction",
      start: "2024-11-23T08:00",
      end: "2024-11-23T10:00",
      host: "John Doe",
      type: "Classroom",
      capacity: 24,
    },
    {
      roomNumber: 1420,
      status: "free",
      event: "",
      start: "2024-11-23T09:00",
      end: "2024-11-23T11:00",
      host: "Jane Smith",
      type: "Conference",
      capacity: 48,
    },
    {
      roomNumber: 1430,
      status: "unconfirmed",
      event: "General Meeting",
      start: "2024-11-23T09:00",
      end: "2024-11-23T11:00",
      host: "Jane Doe",
      type: "Conference",
      capacity: 32,
    },
  ];

  return new Response(JSON.stringify(rooms), {
    headers: { "Content-Type": "application/json" },
  });
}
