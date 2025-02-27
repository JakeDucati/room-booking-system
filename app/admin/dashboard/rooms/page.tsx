"use client";

import { useEffect, useState } from "react";
import { Button } from "@nextui-org/button";
import { Card, Image } from "@nextui-org/react";
import { Plus, Trash2 } from "lucide-react";

import AdminDashboardHeader from "@/components/adminDashboardHeader";
import RoomModal from "@/components/addRoom";
import { useDisclosure } from "@nextui-org/react";

export default function AdminDashboardRooms() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [rooms, setRooms] = useState<{ id: number; name: string; capacity: number }[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<{ id: number; name: string; capacity: number } | null>(null);

  // fetch rooms from api
  useEffect(() => {
    fetch("/api/rooms")
      .then((res) => res.json())
      .then((data) => {
        setRooms(data);
      })
      .catch((err) => console.error("Failed to fetch rooms:", err));
  }, []);

  return (
    <>
      {/* add room */}
      <RoomModal isOpen={isOpen} onOpenChange={onOpenChange} />

      <AdminDashboardHeader text="Rooms">
        <Button onPress={onOpen}>
          <Plus /> <span>Add Room</span>
        </Button>
      </AdminDashboardHeader>

      {/* room List */}
      <div className="flex gap-6 h-full">
        <div className="w-full flex flex-col gap-2 py-2">
          {rooms.map((room) => (
            <Card
              key={room.id}
              isHoverable
              isPressable
              className={`p-3 ${selectedRoom?.id === room.id ? "border border-blue-500" : ""}`}
              onPress={() => setSelectedRoom(room)}
            >
              <div className="flex justify-between w-full">
                <div className="flex flex-col items-baseline">
                  <div className="font-semibold">{room.name}</div>
                  <div>Capacity: {room.capacity}</div>
                </div>
                <div className="flex gap-4 items-center">
                  <div className="text-green-500">Available</div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* room details */}
        <div className="border-l w-1/3 min-w-96 pl-4 h-full flex flex-col gap-2">
          {selectedRoom ? (
            <>
              <Image isBlurred isZoomed src="/default_room.jpg" />
              <div>
                <div className="text-2xl">{selectedRoom.name}</div>
                <div>Capacity: {selectedRoom.capacity}</div>
              </div>
            </>
          ) : (
            <div className="text-center mt-10 text-default-400">Select a room to view details</div>
          )}
        </div>
      </div>
    </>
  );
}
