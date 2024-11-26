"use client";

import { Modal } from "@nextui-org/modal";
import { Card, Spinner } from "@nextui-org/react";
import React, { useEffect, useState } from "react";

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
            <Card className="p-1 cursor-pointer" isPressable isHoverable>
                Host: {host} | {start} - {end}
            </Card>
        </div>
    );
}

export default function Home() {
    const [rooms, setRooms] = useState<Room[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRooms = async () => {
            try {
                const response = await fetch("/api/rooms");
                const data = await response.json();
                setRooms(data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching room data:", error);
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
