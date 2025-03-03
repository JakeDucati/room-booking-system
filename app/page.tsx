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
  roomNumber: number;
  status: string;
  start: string;
  end: string;
  host: string;
  name: string;
  capacity: number;
}

function RoomCalendarItem({
  room,
  onPress,
}: {
  room: Room;
  onPress: (room: Room) => void;
}) {
  return (
    <div className="flex h-16 border-y p-1">
      <div className="w-64 border-r mr-1 flex justify-between sticky left-0 gap-2">
        <div className="w-full">
          <div className="text-xl">
            {room.name} {room.roomNumber}
          </div>
          <div className="text-sm -mt-1 flex items-center gap-2 justify-between">
            {/* issue!! ---------------------------------------------------------------------------------------------------- */}
            <Tooltip className="flex items-center" content="Capacity">
              <User /> {room.capacity}
            </Tooltip>
            <div className="flex items-center gap-1">
              <Tooltip content="A/V Equipment">
                <Projector />
              </Tooltip>
              <Tooltip content="Video Call">
                <Video />
              </Tooltip>
              <Tooltip content="Climate Controls">
                <AirVent />
              </Tooltip>
              <Tooltip content="Device Charging">
                <Plug />
              </Tooltip>
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
                Room {selectedRoom?.roomNumber} Details
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
        <div className="flex gap-32 pl-64 border-t">
          <div>12:00</div>
          <div>1:00</div>
          <div>2:00</div>
        </div>
        <div>
          {rooms.map((room) => (
            <RoomCalendarItem
              key={room.roomNumber}
              room={room}
              onPress={handleCardClick}
            />
          ))}
        </div>
      </section>
    </>
  );
}
