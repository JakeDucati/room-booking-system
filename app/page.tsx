"use client";

import {
  Button,
  Checkbox,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Input,
  Kbd,
  Spinner,
  Tooltip,
  useDisclosure,
} from "@nextui-org/react";
import React, { useEffect, useState, useRef } from "react";
import { toast } from "react-toastify";
import {
  AirVent,
  ChartArea,
  Mouse,
  Plug,
  Projector,
  RefreshCcw,
  Video,
} from "lucide-react";
import Link from "next/link";

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
  image: string;
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
        setLoading(true);
        const response = await fetch("/api/rooms");
        const data = await response.json();

        setRooms(data);
      } catch (error) {
        toast("Error fetching room data!");
      } finally {
        setLoading(false);
        setReload(false);
      }
    };

    if (reload || rooms.length === 0) {
      fetchRooms();
    }
  }, [reload]);

  useEffect(() => {
    const generateTimeSlots = () => {
      const now = new Date();

      now.setMinutes(0, 0, 0);

      const slots: string[] = [];

      for (let i = -12; i < 24; i++) {
        const slotTime = new Date(now);

        slotTime.setHours(now.getHours() + i);
        const formatted = `${slotTime.toLocaleDateString([], { month: "numeric", day: "numeric", year: "2-digit" })} ${slotTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: true })}`;

        slots.push(formatted);
      }

      setTimeSlots(slots);
    };

    generateTimeSlots();
  }, [reload]);

  const scrollToToday = () => {
    if (containerRef.current) {
      containerRef.current.scrollTo({ left: 3200, behavior: "smooth" });
    }
  };

  useEffect(() => {
    setTimeout(scrollToToday, 800);
  }, [reload]);

  useEffect(() => {
    if (!isBookingOpen) {
      setReload(true);
    }
  }, [isBookingOpen]);

  const loadMoreTimeSlots = (direction: "forward" | "backward") => {
    setTimeSlots((prev) => {
      if (prev.length === 0) return prev;

      const newSlots = [...prev];

      if (direction === "forward") {
        const lastSlot = parseTimeSlot(prev[prev.length - 1]);

        for (let i = 1; i <= 1; i++) {
          const nextTime = new Date(lastSlot);

          nextTime.setHours(lastSlot.getHours() + i);
          newSlots.push(formatTimeSlot(nextTime));
        }
      } else if (direction === "backward") {
        const firstSlot = parseTimeSlot(prev[0]);

        for (let i = 1; i <= 1; i++) {
          const prevTime = new Date(firstSlot);

          prevTime.setHours(firstSlot.getHours() - i);
          newSlots.unshift(formatTimeSlot(prevTime));
        }
      }

      return newSlots;
    });
  };

  const parseTimeSlot = (slot: string) => {
    const [date, time, period] = slot.split(" ");
    const [month, day, year] = date.split("/").map(Number);
    const [hour, minute] = time.split(":").map(Number);

    let newHour = hour;

    if (period === "PM" && hour !== 12) newHour += 12;
    if (period === "AM" && hour === 12) newHour = 0;

    return new Date(2000 + year, month - 1, day, newHour, minute);
  };

  const formatTimeSlot = (date: Date) => {
    return `${date.toLocaleDateString([], { month: "numeric", day: "numeric", year: "2-digit" })} ${date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: true })}`;
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
        roomImageUrl={selectedRoom?.image ?? ""}
        roomNumber={selectedRoom?.number ?? 0}
        onOpenChange={onBookingOpenChange}
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
        <div className="mr-2 flex gap-2 items-center">
          <Tooltip content="Shift + Scroll">
            <Kbd className="h-8" keys={"shift"}>
              <Mouse size={16} />
            </Kbd>
          </Tooltip>
          <Button variant="flat" onPress={scrollToToday}>
            Today
          </Button>
          <Tooltip content="Reload">
            <Button isIconOnly variant="flat" onPress={() => setReload(true)}>
              <RefreshCcw />
            </Button>
          </Tooltip>
          <Tooltip content="Analytics">
            <Button isIconOnly as={Link} href="/analytics" variant="flat">
              <ChartArea />
            </Button>
          </Tooltip>
        </div>
      </section>
      <section
        ref={containerRef}
        className="overflow-x-scroll h-full"
        id="scrollContainer"
        onScroll={() => loadMoreTimeSlots("forward")}
      >
        <div className="flex gap-32 pl-72 border-t sticky top-0 w-[max-content]">
          {timeSlots.map((time, index) => (
            <div key={index}>{time}</div>
          ))}
        </div>
        <div>
          {filteredRooms.map((room) => (
            <RoomCalendarItem
              timeSlots={timeSlots}
              onBookRoom={() => handleOpenBooking(room)}
              onBookingClick={handleBookingClick}
              key={room.number}
              // @ts-ignore
              room={room}
            />
          ))}
        </div>
      </section>
    </>
  );
}
