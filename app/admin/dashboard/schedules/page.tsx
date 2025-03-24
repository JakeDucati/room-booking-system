"use client";

import {
  Button,
  Card,
  ScrollShadow,
  Tab,
  Tabs,
  useDisclosure,
} from "@nextui-org/react";
import { Building, Calendar, Clock, Plus, Trash2, User } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import AdminDashboardHeader from "@/app/admin/dashboard/components/adminDashboardHeader";
import CreateBooking from "@/components/createBooking";
import { getApiKey } from "@/lib/apiKeys";

export default function AdminDashboardSchedules() {
  const {
    isOpen: isBookingOpen,
    onOpen: onBookingOpen,
    onOpenChange: onBookingOpenChange,
  } = useDisclosure();

  const [rooms, setRooms] = useState<
    {
      id: number;
      name: string;
      number: number;
      capacity: number;
      features?: string;
      notes?: string;
      image?: string;
      status: string;
    }[]
  >([]);
  const [schedules, setSchedules] = useState<any[]>([]);
  const [selectedSchedule, setSelectedSchedule] = useState<any>(null);
  const [selectedRoom, setSelectedRoom] = useState<any>(null);
  const [roomSchedules, setRoomSchedules] = useState<any[]>([]);
  const [apiKey, setApiKey] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/rooms")
      .then((res) => res.json())
      .then((data) => setRooms(data))
      .catch((err) => toast.error("Failed to fetch rooms"));
  }, []);

  useEffect(() => {
    fetch("/api/bookings")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setSchedules(data);
        } else {
          setSchedules([]);
        }
      })
      .catch((err) => toast.error("Failed to fetch schedules"));
  }, []);

  useEffect(() => {
    if (selectedRoom) {
      fetch(`/api/bookings?roomId=${selectedRoom.id}`)
        .then((res) => res.json())
        .then((data) => {
          setRoomSchedules(data);
        })
        .catch((err) => toast.error("Failed to fetch room schedules"));
    }
  }, [selectedRoom]);

  useEffect(() => {
    const fetchKey = async () => {
      const key = await getApiKey("admin");

      setApiKey(key);
    };

    fetchKey();
  }, []);

  const handleDeleteSchedule = async () => {
    try {
      if (!selectedSchedule) return;

      const formData = new FormData();

      // @ts-ignore
      formData.append("key", apiKey);

      const response = await fetch(
        `/api/deleteSchedule/${selectedSchedule.id}`,
        {
          method: "POST",
          body: formData,
        },
      );

      const data = await response.json();

      if (response.ok) {
        setSchedules(
          schedules.filter((booking) => booking.id !== selectedSchedule.id),
        );
        setSelectedSchedule(null);
      } else {
        toast.error("Error");
      }
    } catch (error) {
      toast.error("Error deleting schedule");
    }
  };

  return (
    <>
      {/* schedule modals */}
      <CreateBooking
        isOpen={isBookingOpen}
        roomImageUrl=""
        roomNumber={0}
        onOpenChange={onBookingOpenChange}
      />

      <AdminDashboardHeader text="Schedules">
        <Button onPress={onBookingOpen}>
          <Plus /> New Schedule
        </Button>
      </AdminDashboardHeader>

      <Tabs fullWidth>
        <Tab key="schedules" className="flex ga-2" title="All Schedules">
          <ScrollShadow className="w-full flex flex-col gap-4 p-2">
            {schedules.map((schedule) => (
              <Card
                key={schedule.id}
                isHoverable
                isPressable
                className={`p-3 min-h-[76px] ${selectedSchedule?.id === schedule.id ? "border border-primary" : ""}`}
                onPress={() => setSelectedSchedule(schedule)}
              >
                <div className="flex justify-between w-full">
                  <div className="flex flex-col items-baseline gap-1">
                    <div className="font-semibold">{schedule.event}</div>
                    <div className="flex items-center">
                      <User className="mr-1" /> {schedule.host}
                    </div>
                  </div>
                  <div className="flex gap-4 items-center">
                    <Clock className="mr-1" />{" "}
                    {new Date(schedule.startTime).toLocaleTimeString()} -{" "}
                    {new Date(schedule.endTime).toLocaleTimeString()}
                  </div>
                </div>
              </Card>
            ))}
          </ScrollShadow>

          {selectedSchedule && (
            <div className="w-1/3 p-4 flex flex-col gap-2 border-l">
              <div className="text-2xl font-semibold">
                {selectedSchedule.event}
              </div>
              <div className="flex items-center gap-2">
                <Building /> Room ID: {selectedSchedule.roomId}
              </div>
              <div className="flex items-center gap-2">
                <User /> Host: {selectedSchedule.host}
              </div>
              <div className="flex items-center gap-2">
                <User /> Scheduler: {selectedSchedule.scheduler}
              </div>
              <div className="flex items-center gap-2">
                <Clock />{" "}
                {new Date(selectedSchedule.startTime).toLocaleTimeString()} -{" "}
                {new Date(selectedSchedule.endTime).toLocaleTimeString()}
              </div>
              <div className="flex items-center gap-2">
                <Calendar /> Created:{" "}
                {new Date(selectedSchedule.createdAt).toLocaleString()}
              </div>
              <Button
                fullWidth
                color="danger"
                variant="flat"
                onPress={handleDeleteSchedule}
              >
                <Trash2 /> Delete Schedule
              </Button>
            </div>
          )}
        </Tab>

        <Tab key="rooms" title="Room Schedules">
          <ScrollShadow className="w-full flex flex-col gap-4 p-2">
            {rooms.map((room) => (
              <Card
                key={room.id}
                isHoverable
                isPressable
                className={`p-3 min-h-[76px] ${selectedRoom?.id === room.id ? "border border-primary" : ""}`}
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
                </div>
              </Card>
            ))}
          </ScrollShadow>

          {selectedRoom && (
            <>
              <div className="text-2xl p-4">
                Schedules for {selectedRoom.number}
              </div>
              {roomSchedules.length > 0 ? (
                <ScrollShadow className="w-full flex flex-col gap-4 p-2">
                  {roomSchedules.map((schedule) => (
                    <Card key={schedule.id} className="p-3">
                      <div className="flex justify-between">
                        <div>
                          <div className="font-semibold">{schedule.event}</div>
                          <div className="flex items-center">
                            <Clock className="mr-1" />{" "}
                            {new Date(schedule.startTime).toLocaleTimeString()}{" "}
                            - {new Date(schedule.endTime).toLocaleTimeString()}
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </ScrollShadow>
              ) : (
                <div className="text-center p-4">
                  No schedules for this room.
                </div>
              )}
            </>
          )}
        </Tab>
      </Tabs>
    </>
  );
}
