"use client";

import { useEffect, useState } from 'react'
import { Card } from "@nextui-org/react";

type RoomData = {
    roomNumber: number,
    status: 'busy' | 'free',
    start: string,
    end: string,
    host: string
}

export default function RoomDisplay({ params }: { params: { roomNumber: string } }) {
    const [room, setRoom] = useState<RoomData | null>(null);
    const roomNumber = parseInt(params.roomNumber);

    useEffect(() => {
        const fetchRoomData = async () => {
            const response = await fetch('/api/rooms');
            const rooms: RoomData[] = await response.json();
            const foundRoom = rooms.find((room) => room.roomNumber === roomNumber);
            setRoom(foundRoom || null);
        }

        fetchRoomData();
    }, [roomNumber]);

    if (!room) {
        return (
            <div className="flex justify-center items-center h-screen">
                <p className="text-xl">Room {roomNumber} not found</p>
            </div>
        );
    }

    return (
        <Card>
            <h1>{room.roomNumber}</h1>
            <div className="mt-4 bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                <p className="text-lg font-semibold">Host: {room.host}</p>
                <p className="text-sm text-gray-600">Status: <span className={room.status === 'busy' ? 'text-red-600' : 'text-green-600'}>{room.status}</span></p>
                <p className="text-sm text-gray-600">Start: {new Date(room.start).toLocaleString()}</p>
                <p className="text-sm text-gray-600">End: {new Date(room.end).toLocaleString()}</p>
            </div>
        </Card>
    )
}
