"use client";

import AdminDashboardHeader from "@/app/admin/dashboard/components/adminDashboardHeader";
import AdminDashboardRooms from "./rooms/page";
import AdminDashboardSchedules from "./schedules/page";

export default function AdminDashboard() {
  const DashboardItem = ({ children }: { children: React.ReactNode }) => {
    return (
      <div className="max-w-[412px] border">
        <div className="scale-50 -m-36">
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
      <div className="flex flex-wrap">
        <DashboardItem>
          <AdminDashboardRooms />
        </DashboardItem>
        <DashboardItem>
          <AdminDashboardSchedules />
        </DashboardItem>
      </div>
    </>
  );
}
