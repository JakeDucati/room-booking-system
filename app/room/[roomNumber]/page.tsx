"use client";

import { useEffect, useState } from "react";
import { Button, Card } from "@nextui-org/react";

import { findRoomByNumber, RoomData } from "@/app/api/rooms/fetchRoomData";

export default function RoomDisplay({
  params,
}: {
  params: { roomNumber: string };
}) {
  const [room, setRoom] = useState<RoomData | null>(null);
  const roomNumber = parseInt(params.roomNumber);

  useEffect(() => {
    const getRoomData = async () => {
      try {
        const foundRoom = await findRoomByNumber(roomNumber);

        setRoom(foundRoom);
      } catch (error) {
        setRoom(null);
      }
    };

    getRoomData();
  }, [roomNumber]);

  if (!room) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-xl">Room {roomNumber} not found</p>
      </div>
    );
  }

  return (
    <div className="flex gap-6 p-6 h-full">
      <Card className="p-9 flex">
        <div className="flex gap-4 w-screen h-full">
          <div>
            <div className="text-5xl mb-2">
              {room.type + " " + room.roomNumber}
            </div>
            <div className="text-xl">
              Booked Until{" "}
              {room.status === "busy" && new Date(room.end).toLocaleString()}
            </div>
          </div>
          {room.status === "busy" ? (
            <Button className="text-2xl">Check In</Button>
          ) : (
            <Button className="size-20">Book Room</Button>
          )}
        </div>
      </Card>
    </div>
  );
}
