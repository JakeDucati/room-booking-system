"use client";

import {
  Button,
  Checkbox,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Input,
  Spinner,
  useDisclosure,
} from "@nextui-org/react";
import React, { useEffect, useState, useRef } from "react";
import { toast } from "react-toastify";
import { AirVent, Plug, Projector, Video } from "lucide-react";

import { ThemeSwitch } from "@/components/theme-switch";
import BookingDetails from "@/components/bookingDetails";
import RoomCalendarItem from "@/components/roomCalendarItem";
import CreateBooking from "@/components/createBooking";

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
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilters, setSelectedFilters] = useState<Set<string>>(
    new Set(),
  );

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

  const handleCardClick = (room: Room) => {
    setSelectedRoom(room);
    onOpen();
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const filteredRooms = rooms.filter((room) => {
    const matchesSearch = room.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    const matchesFeatures =
      selectedFilters.size === 0 ||
      // @ts-ignore
      [...selectedFilters].every((filter) =>
        room.features.split(",").some((feature) => feature.trim() === filter),
      );

    return matchesSearch && matchesFeatures;
  });

  if (loading) {
    return <Spinner className="size-full" size="lg" />;
  }

  const FilterItem = ({
    label,
    icon,
    feature,
  }: {
    label: string;
    icon: React.ReactNode;
    feature: string;
  }) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newFilters = new Set(selectedFilters);

      if (e.target.checked) {
        newFilters.add(feature);
      } else {
        newFilters.delete(feature);
      }
      setSelectedFilters(newFilters);
    };

    return (
      <Checkbox
        isSelected={selectedFilters.has(feature)}
        onChange={handleChange}
      >
        <div className="flex gap-2">
          {icon}
          {label}
        </div>
      </Checkbox>
    );
  };

  return (
    <>
      <CreateBooking
        isOpen={isOpen}
        roomNumber={selectedRoom?.number}
        onOpenChange={onOpenChange}
      />
      <BookingDetails
        isOpen={isOpen}
        selectedRoom={selectedRoom}
        onOpenChange={onOpenChange}
      />
      <section className="flex">
        <div className="w-64 p-2 flex gap-2">
          <Dropdown closeOnSelect={false}>
            <DropdownTrigger>
              <Button variant="bordered">Filter</Button>
            </DropdownTrigger>
            <DropdownMenu>
              <DropdownItem>
                <Input
                  label="Search"
                  value={searchTerm}
                  onChange={handleSearchChange}
                />
              </DropdownItem>
              <DropdownItem>
                <FilterItem
                  feature="av_equipment"
                  icon={<Projector />}
                  label="A/V Equipment"
                />
              </DropdownItem>
              <DropdownItem>
                <FilterItem
                  feature="video_conferencing"
                  icon={<Video />}
                  label="Video Conferencing"
                />
              </DropdownItem>
              <DropdownItem>
                <FilterItem
                  feature="climate_controls"
                  icon={<AirVent />}
                  label="Climate Controls"
                />
              </DropdownItem>
              <DropdownItem>
                <FilterItem
                  feature="device_charging"
                  icon={<Plug />}
                  label="Device Charging"
                />
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
          {(searchTerm || selectedFilters.size > 0) && (
            <Button
              variant="ghost"
              onPress={() => {
                setSearchTerm("");
                setSelectedFilters(new Set());
              }}
            >
              Clear Filters
            </Button>
          )}
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
          {filteredRooms.map((room) => (
            <RoomCalendarItem
              key={room.number}
              // @ts-ignore
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
