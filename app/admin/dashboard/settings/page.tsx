import AdminDashboardHeader from "@/components/adminDashboardHeader";
import { Button } from "@nextui-org/button";
import { Divider } from "@nextui-org/react";
import { Plus } from "lucide-react";

export default function AdminDashboardSettings() {
  return (
    <>
      <AdminDashboardHeader text="Settings" children={undefined} />
      <div className="flex flex-col">
        <div className="flex gap-4">
          <div className="w-1/2">
            <div className="flex items-center justify-between">
              <div className="text-xl font-bold">General</div>
            </div>
            <div>
              options
            </div>
          </div>
          <div className="w-1/2">
            <div className="flex items-center justify-between">
              <div className="text-xl font-bold">API Keys</div>
              <Button

              >
                <Plus /> New Key
              </Button>
            </div>
            <div>
              options
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
