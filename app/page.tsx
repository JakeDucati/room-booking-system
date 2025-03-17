"use client";

import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Input, Spinner, useDisclosure } from "@nextui-org/react";
import React, { useEffect, useState, useRef } from "react";
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
  bookings: Booking[];
}

interface Booking {
  id: number;
  roomId: number;
  startTime: string;
  endTime: string;
}

export default function Home() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [timeSlots, setTimeSlots] = useState<string[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    const generateTimeSlots = () => {
      const now = new Date();
      now.setMinutes(0, 0, 0);

      const slots = [];

      for (let i = 0; i < 48; i++) {
        const slotTime = new Date(now);
        slotTime.setHours(now.getHours() + i);
        const formatted = `${slotTime.toLocaleDateString([], { month: "numeric", day: "numeric", year: "2-digit" })} ${slotTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: true })}`;

        slots.push(formatted);
      }
      setTimeSlots(slots);
    };

    generateTimeSlots();
  }, []);

  const loadMoreTimeSlots = () => {
    setTimeSlots((prev) => {
      if (prev.length === 0) return prev;

      const lastSlot = prev[prev.length - 1];
      const lastTime = new Date();

      const [date, time, period] = lastSlot.split(" ");
      const [month, day, year] = date.split("/").map(Number);
      const [hour, minute] = time.split(":").map(Number);

      let newHour = hour;

      if (period === "PM" && hour !== 12) newHour += 12;
      if (period === "AM" && hour === 12) newHour = 0;

      lastTime.setFullYear(2000 + year, month - 1, day);
      lastTime.setHours(newHour, minute, 0, 0);

      const newSlots = [...prev];

      for (let i = 0; i < 12; i++) {
        lastTime.setHours(lastTime.getHours() + 1);
        const formatted = `${lastTime.toLocaleDateString([], { month: "numeric", day: "numeric", year: "2-digit" })} ${lastTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: true })}`;

        newSlots.push(formatted);
      }

      return newSlots;
    });
  };

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
          <Dropdown>
            <DropdownTrigger>
              <Button variant="bordered">Filter</Button>
            </DropdownTrigger>
            <DropdownMenu>
              <DropdownItem key="new"><Input label="Search" /></DropdownItem>
              <DropdownItem key="copy">Copy link</DropdownItem>
              <DropdownItem key="edit">Edit file</DropdownItem>
              <DropdownItem key="delete" className="text-danger" color="danger">
                Delete file
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
        <ThemeSwitch />
        <div className="w-full flex justify-center items-center">
          <div className="text-4xl">Room Booking</div>
        </div>
      </section>
      <section
        ref={containerRef}
        className="overflow-x-scroll h-full"
        id="scrollContainer"
        onScroll={() => loadMoreTimeSlots()}
      >
        <div className="flex gap-32 pl-72 border-t sticky top-0 w-[max-content]">
          {timeSlots.map((time, index) => (
            <div key={index}>{time}</div>
          ))}
        </div>
        <div>
          {rooms.map((room) => (
            <RoomCalendarItem
              key={room.number}
              room={room}
              timeSlots={timeSlots}
              // @ts-ignore
              onPress={handleCardClick}
            />
          ))}
        </div>
      </section>
    </>
  );
}
