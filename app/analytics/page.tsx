"use client"

import { Card } from "@nextui-org/react";
import { User } from "lucide-react";
import { useEffect, useState } from "react";

export default function Analytics() {
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
            <div className="overflow-x-scroll flex gap-4">
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
            </div>
        </>
    );
}
