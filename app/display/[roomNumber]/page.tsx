"use client";

import { useEffect, useState } from "react";
import { Card } from "@nextui-org/react";

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
    <div className="flex flex-col gap-6 p-6 h-full">
      <Card className="p-9 flex w-full min-h-min">
        <div className="flex justify-between">
          <div className="flex gap-10">
            <div
              className={`rounded-full min-w-72 min-h-72 flex border-8 ${
                room.status === "busy"
                  ? "border-red-600"
                  : room.status === "free"
                    ? "border-green-600"
                    : "border-amber-600"
              }`}
            >
              <div
                className={`m-auto flex flex-col ${room.status === "unconfirmed" ? "text-4xl" : "text-6xl"}`}
              >
                {room.status === "busy"
                  ? "Busy"
                  : room.status === "free"
                    ? "Free"
                    : "Unconfirmed"}
              </div>
            </div>
            <div className="flex flex-col justify-center gap-10">
              <div>
                <div className="text-5xl mb-2">
                  {room.type + " " + room.roomNumber}
                </div>
                <div className="text-xl">
                  Until{" "}
                  {room.status === "busy" &&
                    new Date(room.end).toLocaleString()}
                </div>
              </div>
              <div>
                <div className="text-xl">{room.event}</div>
                <div className="text-xl">Host: {room.host}</div>
              </div>
            </div>
          </div>
          <div className="w-1/4 right-0 my-auto">
            <div className="text-2xl animate-pulse">
              {room.status === "unconfirmed" &&
                "This room may be available soon if the host does not check in!"}
            </div>
          </div>
        </div>
      </Card>
      <Card className="p-9 w-full h-full">
        <div>quick schedule area goes here</div>
      </Card>
    </div>
  );
}
