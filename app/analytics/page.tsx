"use client";

import { Button } from "@nextui-org/react";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

import { ThemeSwitch } from "@/components/theme-switch";
import RoomAnalytics from "@/components/roomAnalytics";

export default function Analytics() {
  return (
    <>
      <section className="flex items-center border-b p-2 gap-2">
        <Button as={Link} className="w-64 flex justify-center" href="/">
          <div className="flex items-center">
            <ChevronLeft /> Back To Scheduler
          </div>
        </Button>
        <ThemeSwitch />
        <div className="w-full flex justify-center items-center">
          <div className="text-4xl">Room Analytics</div>
        </div>
      </section>

      <RoomAnalytics />
    </>
  );
}
