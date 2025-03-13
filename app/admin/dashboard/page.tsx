"use client";

import AdminDashboardHeader from "@/app/admin/dashboard/components/adminDashboardHeader";
import AdminDashboardRooms from "./rooms/page";
import AdminDashboardSchedules from "./schedules/page";
import AdminDashboardSettings from "./settings/page";

export default function AdminDashboard() {
  const DashboardItem = ({ children }: { children: React.ReactNode }) => {
    return (
      <div className="w-[412px] h-[412px] border">
        <div className="scale-50 min-w-[400px] min-h-[400px] -m-36">
          {children}
        </div>
      </div>
    );
  }

  return (
    <>
      <AdminDashboardHeader text="Dashboard">
        <></>
      </AdminDashboardHeader>
      <div className="flex flex-wrap gap-4">
        <DashboardItem>
          <AdminDashboardRooms />
        </DashboardItem>
        <DashboardItem>
          <AdminDashboardSchedules />
        </DashboardItem>
        <DashboardItem>
          <AdminDashboardSettings />
        </DashboardItem>
      </div>
      {/* just make the squares show numbers and graphs and stuff thats like number of rooms, current schedules in effect, total room capacity (across all rooms) */}
    </>
  );
}
