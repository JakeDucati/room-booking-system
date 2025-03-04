"use client";

import {
  Button,
  Card,
  Input,
  Spinner,
  Tooltip,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react";
import { AirVent, Plug, Plus, Projector, Video, User } from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

import { ThemeSwitch } from "@/components/theme-switch";

interface Room {
  number: number;
  status: string;
  start: string;
  end: string;
  host: string;
  name: string;
  capacity: number;
  features: string,
}

function RoomCalendarItem({
  room,
  onPress,
}: {
  room: Room;
  onPress: (room: Room) => void;
}) {
  const featureIcons = {
    av_equipment: { tooltip: <Tooltip content="A/V Equipment"><Projector /></Tooltip> },
    video_conferencing: { tooltip: <Tooltip content="Video Conferencing"><Video /></Tooltip> },
    climate_controls: { tooltip: <Tooltip content="Climate Controls"><AirVent /></Tooltip> },
    device_charging: { tooltip: <Tooltip content="Device Charging"><Plug /></Tooltip> },
  };

  const features = room.features
    ? room.features.split(",")
    : [];

  return (
    <div className="flex h-18 border-y p-1">
      <div className="w-72 border-r mr-1 flex justify-between sticky left-0 gap-2">
        <div className="w-full flex flex-col gap-2">
          <div className="text-xl">
            {room.name} {room.number}
          </div>
          <div className="text-sm -mt-1 flex items-center gap-2 justify-between">
            <div className="flex items-center -ml-1">
              <Tooltip content="Capacity">
                <User />
              </Tooltip>
              {room.capacity}
            </div>
            <div className="flex items-center gap-1">
              {features.map((feature) => {
                // @ts-ignore
                const featureData = featureIcons[feature.trim()];

                return featureData ? (
                  <div key={feature} className="flex gap-2">
                    {featureData.tooltip}
                  </div>
                ) : null;
              })}
            </div>
          </div>
        </div>
        <div className="flex items-center pr-3">
          <Tooltip content="Book Room" placement="right">
            <Button isIconOnly>
              <Plus />
            </Button>
          </Tooltip>
        </div>
      </div>
      <Card
        isHoverable
        isPressable
        className="p-1 cursor-pointer"
        onPress={() => onPress(room)}
      >
        <div>Host: {room.host}</div>
        <div>
          {room.start} - {room.end}
        </div>
      </Card>
    </div>
  );
}

export default function Home() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await fetch("/api/rooms");
        const data = await response.json();

        setRooms(data);
        setLoading(false);
      } catch (error) {
        toast("Error fetching room data!");
        setLoading(false);
      }
    };

    fetchRooms();
  }, []);

  if (loading) {
    return <Spinner className="size-full" size="lg" />;
  }

  const handleCardClick = (room: Room) => {
    setSelectedRoom(room);
    onOpen();
  };

  return (
    <>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Room {selectedRoom?.number} Details
              </ModalHeader>
              <ModalBody>
                {selectedRoom && (
                  <>
                    <p>
                      <strong>Type:</strong> {selectedRoom.name}
                    </p>
                    <p>
                      <strong>Host:</strong> {selectedRoom.host}
                    </p>
                    <p>
                      <strong>Capacity:</strong> {selectedRoom.capacity}
                    </p>
                    <p>
                      <strong>Schedule:</strong> {selectedRoom.start} -{" "}
                      {selectedRoom.end}
                    </p>
                  </>
                )}
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      <section className="flex">
        <div className="w-64 p-2">
          <Input label="Search" type="text" />
        </div>
        <ThemeSwitch />
        <div className="w-full flex justify-center items-center">
          <div className="text-4xl">Room Booking</div>
        </div>
      </section>
      <section className="overflow-x-scroll h-full">
        {/* ISSUE STICKY ------------------------------------------------------------------------------ */}
        <div className="flex gap-32 pl-64 border-t sticky top-0">
          <div>12:00</div>
          <div>1:00</div>
          <div>2:00</div>
        </div>
        <div>
          {rooms.map((room) => (
            <RoomCalendarItem
              key={room.number}
              room={room}
              onPress={handleCardClick}
            />
          ))}
        </div>
      </section>
    </>
  );
}
