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
  Tooltip,
  useDisclosure,
} from "@nextui-org/react";
import React, { useEffect, useState, useRef } from "react";
import { toast } from "react-toastify";
import { AirVent, Plug, Projector, RefreshCcw, Video } from "lucide-react";

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

export default function Scheduler() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [reload, setReload] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const {
    isOpen: isBookingOpen,
    onOpen: onBookingOpen,
    onOpenChange: onBookingOpenChange,
  } = useDisclosure();
  const {
    isOpen: isDetailsOpen,
    onOpen: onDetailsOpen,
    onOpenChange: onDetailsOpenChange,
  } = useDisclosure();
  const [timeSlots, setTimeSlots] = useState<string[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilters, setSelectedFilters] = useState<Set<string>>(
    new Set(),
  );

  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  const handleBookingClick = (booking: Booking) => {
    setSelectedBooking(booking);
    onDetailsOpen();
  };

  const handleOpenBooking = (room: Room) => {
    setSelectedRoom(room);
    onBookingOpen();
  };


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
    setReload(false);
  }, [reload]);

  useEffect(() => {
    const generateTimeSlots = () => {
      const now = new Date();
      now.setMinutes(0, 0, 0);

      const slots = [];
      for (let i = 0; i < 24; i++) {
        const slotTime = new Date(now);
        slotTime.setHours(now.getHours() + i);
        const formatted = `${slotTime.toLocaleDateString([], { month: "numeric", day: "numeric", year: "2-digit" })} ${slotTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: true })}`;
        slots.push(formatted);
      }
      setTimeSlots(slots);
    };

    generateTimeSlots();
  }, []);

  const scrollCount = useRef(0);

  const loadMoreTimeSlots = () => {
    scrollCount.current += 1;

    if (scrollCount.current % 1 === 0) {
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
        lastTime.setHours(lastTime.getHours() + 1);

        const formatted = `${lastTime.toLocaleDateString([], { month: "numeric", day: "numeric", year: "2-digit" })} ${lastTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: true })}`;

        return [...prev, formatted];
      });
    }
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
        isOpen={isBookingOpen}
        roomNumber={selectedRoom?.number ?? 0}
        onOpenChange={onBookingOpen}
      />
      <BookingDetails
        isOpen={isDetailsOpen}
        // @ts-ignore
        selectedBooking={selectedBooking}
        onOpenChange={onDetailsOpenChange}
      />
      <section className="flex items-center">
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
        <Tooltip content="Reload">
          <Button
            isIconOnly
            onPress={() => { setReload(true) }}
            className="mr-2"
            variant="flat"
          >
            <RefreshCcw />
          </Button>
        </Tooltip>
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
              onBookingClick={handleBookingClick}
              onBookRoom={() => handleOpenBooking(room)}
            />
          ))}
        </div>
      </section>
    </>
  );
}
