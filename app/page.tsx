"use client";

import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from "@nextui-org/modal";
import { Button, Card, Spinner } from "@nextui-org/react";
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
    type,
    number,
    capacity,
    host,
    start,
    end,
}: {
    type: string;
    number: number;
    capacity: number;
    host: string;
    start: string;
    end: string;
}) {
    return (
        <div className="flex h-16 border-y p-1">
            <div className="w-56 border-r mr-1">
                <div className="text-xl">
                    {type} {number}
                </div>
                <div className="text-sm -mt-1">Capacity: {capacity}</div>
            </div>
            <Card
                className="p-1 cursor-pointer"
                // onPress={onOpen}
                isPressable
                isHoverable
            >
                Host: {host} | {start} - {end}
            </Card>
        </div>
    );
}

export default function Home() {
    const [rooms, setRooms] = useState<Room[]>([]);
    const [loading, setLoading] = useState(true);

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
        return <Spinner />;
    }

    return (
        <>
            <Modal isOpen={isOpen} onOpenChange={onOpenChange} isDismissable={false}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">Modal Title</ModalHeader>
                            <ModalBody>
                                <p>Text</p>
                            </ModalBody>
                            <ModalFooter>
                                <Button color="danger" variant="light" onPress={onClose}>
                                    Close
                                </Button>
                                <Button color="primary" onPress={onClose}>
                                    Action
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
            <header></header>
            <section>
                {rooms.map((room) => (
                    <RoomCalendarItem
                        key={room.roomNumber}
                        type={room.type}
                        number={room.roomNumber}
                        capacity={room.capacity}
                        host={room.host}
                        start={room.start}
                        end={room.end}
                    />
                ))}
            </section>
        </>
    );
}
