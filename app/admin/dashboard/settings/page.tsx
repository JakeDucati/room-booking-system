import { Button } from "@nextui-org/button";
import { Plus } from "lucide-react";

import AdminDashboardHeader from "@/app/admin/dashboard/components/adminDashboardHeader";

export default function AdminDashboardSettings() {
  return (
    <>
      <AdminDashboardHeader text="Settings">
        <></>
      </AdminDashboardHeader>
      <div className="flex flex-col">
        <div className="flex gap-4">
          <div className="w-1/2">
            <div className="flex items-center justify-between">
              <div className="text-xl font-bold">General</div>
            </div>
            <div>options</div>
          </div>
          <div className="w-1/2">
            <div className="flex items-center justify-between">
              <div className="text-xl font-bold">API Keys</div>
              <Button>
                <Plus /> New Key
              </Button>
            </div>
            <div>{/* map all keys here */}</div>
          </div>
        </div>
      </div>
    </>
  );
}
