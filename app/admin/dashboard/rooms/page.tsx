"use client";

import { useEffect, useState } from "react";
import { Button } from "@nextui-org/button";
import { Card, Image, ScrollShadow } from "@nextui-org/react";
import { AirVent, Pencil, Plug, Plus, Projector, Trash2, Video } from "lucide-react";

import AdminDashboardHeader from "@/components/adminDashboardHeader";
import RoomModal from "@/components/addRoom";
import { useDisclosure } from "@nextui-org/react";

export default function AdminDashboardRooms() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [rooms, setRooms] = useState<{ id: number; name: string; number: number; capacity: number }[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<{ id: number; name: string; number: number; capacity: number; notes: string; features: string } | null>(null);

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
      <div className="flex gap-6 h-full pb-4">
        <ScrollShadow className="w-full flex flex-col gap-4 p-2">
          {rooms.map((room) => (
            <Card
              key={room.id}
              isHoverable
              isPressable
              className={`p-3 min-h-[72px] ${selectedRoom?.id === room.id ? "border border-blue-500" : ""}`}
              // @ts-ignore
              onPress={() => setSelectedRoom(room)}
            >
              <div className="flex justify-between w-full">
                <div className="flex flex-col items-baseline">
                  <div className="font-semibold">{room.name} {room.number}</div>
                  <div>Capacity: {room.capacity}</div>
                </div>
                <div className="flex gap-4 items-center">
                  <div className="text-success">Available</div>
                </div>
              </div>
            </Card>
          ))}
        </ScrollShadow>

        {/* room details */}
        <div className="border-l w-1/3 min-w-96 pl-4 max-h-[calc(100vh-100px)] flex flex-col gap-2">
          {selectedRoom ? (
            <>
              <Image isBlurred isZoomed src="/default_room.jpg" />
              <div className="flex flex-col justify-between h-full">
                <div className="flex flex-col gap-2">
                  <div className="text-2xl flex justify-between">
                    <div>{selectedRoom.name}</div>
                    <div>{selectedRoom.number}</div>
                  </div>
                  <div>Capacity: {selectedRoom.capacity}</div>
                  {
                    selectedRoom.notes && (
                      <div>
                        <div className="font-bold">Notes</div>
                        <div>{selectedRoom.notes}</div>
                      </div>
                    )
                  }
                  <div>
                    <div className="font-bold">Features</div>
                    {selectedRoom.features}
                    <div>
                      {selectedRoom.features == "av_equipment" && (<div className="flex gap-2"><Projector /> A/V Equipment</div>)}
                      {selectedRoom.features == "video_conferencing" && (<div className="flex gap-2"><Video /> Video Conferencing</div>)}
                      {selectedRoom.features == "climate_controls" && (<div className="flex gap-2"><AirVent /> Climate Controls</div>)}
                      {selectedRoom.features == "device_charging" && (<div className="flex gap-2"><Plug /> Device Charging</div>)}
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <div>ID: {selectedRoom.id}</div>
                  <Button
                    variant="ghost"
                    fullWidth
                  >
                    <Pencil /> Edit Room Details
                  </Button>
                  <Button
                    color="danger"
                    variant="flat"
                    fullWidth
                  >
                    <Trash2 /> Delete Room
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="text-center mt-10 text-default-400">Select a room</div>
          )}
        </div>
      </div>
    </>
  );
}
