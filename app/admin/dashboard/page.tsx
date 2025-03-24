"use client";

import { useEffect, useState } from "react";
import { Card } from "@nextui-org/react";
import {
  Building,
  CalendarCheck,
  CalendarDays,
  CalendarRange,
  Users,
} from "lucide-react";
import { toast } from "react-toastify";

import AdminDashboardHeader from "@/app/admin/dashboard/components/adminDashboardHeader";
import RoomAnalytics from "@/components/roomAnalytics";

export default function AdminDashboard() {
  const [dashboardData, setDashboardData] = useState({
    totalRooms: 0,
    totalSchedules: 0,
    currentlyScheduled: 0,
    currentlyFree: 0,
    totalBuildingCapacity: 0,
  });

  useEffect(() => {
    fetch("/api/bigData")
      .then((res) => res.json())
      .then((data) => setDashboardData(data))
      .catch((err) => toast.error("Failed to fetch dashboard data"));
  }, []);

  const DashboardItem = ({
    label,
    icon: Icon,
    data,
  }: {
    label: string;
    icon: any;
    data: number;
  }) => {
    return (
      <Card isHoverable className="p-2 w-64">
        <div className="flex gap-2 items-center">
          <Icon size={52} />
          <div className="flex flex-col">
            <div className="text-2xl font-bold">{data}</div>
            <div>{label}</div>
          </div>
        </div>
      </Card>
    );
  };

  return (
    <>
      <AdminDashboardHeader text="Dashboard">
        <></>
      </AdminDashboardHeader>
      <div className="flex flex-wrap gap-4">
        <DashboardItem
          data={dashboardData.totalRooms}
          icon={Building}
          label="Total Rooms"
        />
        <DashboardItem
          data={dashboardData.totalSchedules}
          icon={CalendarDays}
          label="Total Schedules"
        />
        <DashboardItem
          data={dashboardData.currentlyScheduled}
          icon={CalendarRange}
          label="Currently Scheduled"
        />
        <DashboardItem
          data={dashboardData.currentlyFree}
          icon={CalendarCheck}
          label="Currently Free"
        />
        <DashboardItem
          data={dashboardData.totalBuildingCapacity}
          icon={Users}
          label="Total Building Capacity"
        />
      </div>
      <div className="flex">
        <div className="w-1/2">
          <RoomAnalytics />
        </div>
        <div className="w-1/2 mt-24">
          <RoomAnalytics showAllRooms />
        </div>
      </div>
    </>
  );
}
