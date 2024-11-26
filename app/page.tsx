"use client";

import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from "@nextui-org/modal";
import { Button, Card, Input, Spinner, Tooltip } from "@nextui-org/react";
import { Plus } from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

type Room = {
    roomNumber: number;
    status: string;
    start: string;
    end: string;
    host: string;
    type: string;
    capacity: number;
};

function RoomCalendarItem({
    room,
    onClick,
}: {
    room: Room;
    onClick: (room: Room) => void;
}) {
    return (
        <div className="flex h-16 border-y p-1">
            <div className="w-64 border-r mr-1 flex justify-between sticky left-0">
                <div>
                    <div className="text-xl">
                        {room.type} {room.roomNumber}
                    </div>
                    <div className="text-sm -mt-1">Capacity: {room.capacity}</div>
                </div>
                <div className="flex items-center pr-3">
                    <Tooltip
                        content="Book Room"
                        placement="right"
                    >
                        <Button
                            isIconOnly

                        >
                            <Plus />
                        </Button>
                    </Tooltip>
                </div>
            </div>
            <Card
                className="p-1 cursor-pointer"
                isPressable
                isHoverable
                onClick={() => onClick(room)}
            >
                Host: {room.host} | {room.start} - {room.end}
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
                console.error("Error fetching room data:", error);
                toast("Error fetching room data!");
                setLoading(false);
            }
        };

        fetchRooms();
    }, []);

    if (loading) {
        return <Spinner size="lg" className="size-full" />;
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
                                            <strong>Type:</strong> {selectedRoom.type}
                                        </p>
                                        <p>
                                            <strong>Host:</strong> {selectedRoom.host}
                                        </p>
                                        <p>
                                            <strong>Capacity:</strong> {selectedRoom.capacity}
                                        </p>
                                        <p>
                                            <strong>Schedule:</strong> {selectedRoom.start} - {selectedRoom.end}
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
                    <Input
                        type="text"
                        label="Search"
                    />
                </div>
                <div className="w-full flex justify-center items-center">
                    <div className="text-4xl">
                        Room Booking
                    </div>
                </div>
            </section>
            <section className="overflow-x-scroll">
                {rooms.map((room) => (
                    <RoomCalendarItem
                        key={room.roomNumber}
                        room={room}
                        onClick={handleCardClick}
                    />
                ))}
            </section>
        </>
    );
}
