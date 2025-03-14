"use client";

import { useEffect, useState } from "react";
import { Button } from "@nextui-org/button";
import { Card, Image, ScrollShadow, Tooltip } from "@nextui-org/react";
import {
  AirVent,
  Calendar,
  Pencil,
  Plug,
  Plus,
  Projector,
  Trash2,
  User,
  Video,
} from "lucide-react";
import { useDisclosure } from "@nextui-org/react";
import Link from "next/link";

import AdminDashboardHeader from "@/app/admin/dashboard/components/adminDashboardHeader";
import AddRoomModal from "@/app/admin/dashboard/components/addRoom";
import EditRoomModal from "../components/editRoom";

export default function AdminDashboardRooms() {
  const { isOpen: isAddOpen, onOpen: onAddOpen, onOpenChange: onAddOpenChange } = useDisclosure();
  const { isOpen: isEditOpen, onOpen: onEditOpen, onOpenChange: onEditOpenChange } = useDisclosure();

  const [rooms, setRooms] = useState<
    {
      id: number;
      name: string;
      number: number;
      capacity: number;
      image: string;
    }[]
  >([]);
  const [selectedRoom, setSelectedRoom] = useState<{
    id: number;
    name: string;
    number: number;
    capacity: number;
    notes: string;
    features: string;
    image: string;
  } | null>(null);

  const featureIcons = {
    av_equipment: { icon: <Projector />, label: "A/V Equipment" },
    video_conferencing: { icon: <Video />, label: "Video Conferencing" },
    climate_controls: { icon: <AirVent />, label: "Climate Controls" },
    device_charging: { icon: <Plug />, label: "Device Charging" },
  };

  const features = selectedRoom?.features
    ? selectedRoom.features.split(",")
    : [];

  // fetch rooms from api
  useEffect(() => {
    fetch("/api/rooms")
      .then((res) => res.json())
      .then((data) => {
        setRooms(data);
      })
      .catch((err) => console.error("Failed to fetch rooms:", err));
  }, [onAddOpenChange, onEditOpenChange]);

  useEffect(() => {
    setSelectedRoom(selectedRoom);
  }, [onEditOpenChange]);

  return (
    <>
      {/* add room */}
      <AddRoomModal isOpen={isAddOpen} onOpenChange={onAddOpenChange} />
      <EditRoomModal isOpen={isEditOpen} onOpenChange={onEditOpenChange} room={selectedRoom} />

      <AdminDashboardHeader text="Rooms">
        <div className="flex items-center gap-2">
          {selectedRoom && (
            <Button
              variant="ghost"
              onPress={() => {
                setSelectedRoom(null);
              }}
            >
              Deselect
            </Button>
          )}
          <Button onPress={onAddOpen}>
            <Plus /> Add Room
          </Button>
        </div>
      </AdminDashboardHeader>

      {/* room List */}
      <div className="flex gap-6 h-full pb-4">
        <ScrollShadow className="w-full flex flex-col gap-4 p-2">
          {rooms.map((room) => (
            <Card
              key={room.id}
              isHoverable
              isPressable
              className={`p-3 min-h-[76px] ${selectedRoom?.id === room.id ? "border border-blue-500" : ""}`}
              // @ts-ignore
              onPress={() => setSelectedRoom(room)}
            >
              <div className="flex justify-between w-full">
                <div className="flex flex-col items-baseline gap-1">
                  <div className="font-semibold">
                    {room.number} {room.name}
                  </div>
                  <div className="flex items-center">
                    <User /> {room.capacity}
                  </div>
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
              <div>
                <Image
                  isBlurred
                  isZoomed
                  src={selectedRoom.image || "/default_room.jpg"}
                  alt="photo of room"
                />
                <div className="absolute text-xs -mt-1">
                  {!selectedRoom.image && "Default Image"}
                </div>
              </div>
              <div className="flex flex-col justify-between h-full">
                <div className="flex flex-col gap-2">
                  <div className="text-2xl flex justify-between">
                    <div>{selectedRoom.name}</div>
                    <div>{selectedRoom.number}</div>
                  </div>
                  <Tooltip content="Capacity" placement="right">
                    <div className="flex max-w-min">
                      <User /> {selectedRoom.capacity}
                    </div>
                  </Tooltip>
                  {selectedRoom.notes && (
                    <div>
                      <div className="font-bold">Notes</div>
                      <div>{selectedRoom.notes}</div>
                    </div>
                  )}
                  <div>
                    <div className="font-bold">Features</div>
                    <div>
                      {features.map((feature) => {
                        // @ts-ignore
                        const featureData = featureIcons[feature.trim()];

                        return featureData ? (
                          <div key={feature} className="flex gap-2">
                            {featureData.icon} {featureData.label}
                          </div>
                        ) : null;
                      })}
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <div>ID: {selectedRoom.id}</div>
                  <Button
                    fullWidth
                    as={Link}
                    href={`/admin/dashboard/schedules?room=${selectedRoom.id}`}
                    variant="ghost"
                  >
                    <Calendar /> Schedules
                  </Button>
                  <Button fullWidth variant="ghost" onPress={onEditOpen}>
                    <Pencil /> Edit Details
                  </Button>
                  <Button fullWidth color="danger" variant="flat">
                    <Trash2 /> Delete Room
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="text-center mt-10 text-default-400">
              Select a room
            </div>
          )}
        </div>
      </div>
    </>
  );
}
