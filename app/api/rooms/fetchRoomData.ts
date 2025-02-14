export type RoomData = {
  roomNumber: number;
  status: "busy" | "free" | "unconfirmed";
  event: string;
  start: string;
  end: string;
  host: string;
  type: string;
};

export const fetchRoomData = async (): Promise<RoomData[]> => {
  const response = await fetch("/api/rooms");

  if (!response.ok) {
    throw new Error("Failed to fetch room data");
  }

  return await response.json();
};

export const findRoomByNumber = async (
  roomNumber: number,
): Promise<RoomData | null> => {
  const rooms = await fetchRoomData();

  return rooms.find((room) => room.roomNumber === roomNumber) || null;
};
