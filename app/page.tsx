"use client";

import {
  Input,
  Spinner,
  useDisclosure,
} from "@nextui-org/react";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

import { ThemeSwitch } from "@/components/theme-switch";
import BookingDetails from "@/components/bookingDetails";
import RoomCalendarItem from "@/components/roomCalendarItem";

interface Room {
  number: number;
  status: string;
  start: string;
  end: string;
  host: string;
  name: string;
  capacity: number;
  features: string;
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
      <BookingDetails
        isOpen={isOpen}
        selectedRoom={selectedRoom}
        onOpenChange={onOpenChange}
      />

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
        <div className="flex gap-32 pl-72 border-t sticky top-0 w-[4700px]">
          <div>12:00pm</div>
          <div>1:00pm</div>
          <div>2:00pm</div>
          <div>3:00pm</div>
          <div>4:00pm</div>
          <div>5:00pm</div>
          <div>6:00pm</div>
          <div>7:00pm</div>
          <div>8:00pm</div>
          <div>9:00pm</div>
          <div>10:00pm</div>
          <div>11:00pm</div>
          <div>12:00am</div>
          <div>1:00am</div>
          <div>2:00am</div>
          <div>3:00am</div>
          <div>4:00am</div>
          <div>5:00am</div>
          <div>6:00am</div>
          <div>7:00am</div>
          <div>8:00am</div>
          <div>9:00am</div>
          <div>10:00am</div>
          <div>11:00am</div>
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
