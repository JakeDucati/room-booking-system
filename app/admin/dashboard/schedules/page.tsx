"use client";

import { Button, Card, ScrollShadow, Tab, Tabs } from "@nextui-org/react";
import { Plus, User } from "lucide-react";
import { useEffect, useState } from "react";

import AdminDashboardHeader from "@/app/admin/dashboard/components/adminDashboardHeader";

export default function AdminDashboardSchedules() {
  const [rooms, setRooms] = useState<
    { id: number; name: string; number: number; capacity: number }[]
  >([]);
  const [selectedRoom, setSelectedRoom] = useState<{
    id: number;
    name: string;
    number: number;
    capacity: number;
    notes: string;
    features: string;
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
      <AdminDashboardHeader text="Schedules">
        <Button>
          <Plus /> <span>New Schedule</span>
        </Button>
      </AdminDashboardHeader>
      <Tabs fullWidth>
        <Tab key="schedules" title="All Schedules">
          <div>
            <Button>Clear All Schedules</Button>
          </div>
          schedule data in calendar form
        </Tab>
        <Tab key="rooms" title="Room Schedules">
          <div>
            <Button>Clear Room Schedules</Button>
          </div>
          <ScrollShadow className="w-full flex flex-col gap-4 p-2">
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
          </ScrollShadow>
        </Tab>
      </Tabs>
    </>
  );
}
