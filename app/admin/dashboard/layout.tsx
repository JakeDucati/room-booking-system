"use client";

import { ThemeSwitch } from "@/components/theme-switch";
import { Tooltip } from "@nextui-org/react";
import { Building, Calendar, House, Settings } from "lucide-react";
import Link from "next/link";

export default function AdminDashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const NavItem = ({ name, href, icon }: { name: string; href: string; icon: React.ReactNode }) => (
        <Tooltip content={name} placement="right">
            <Link href={`/admin/dashboard${href}`} className="p-2">
                {icon}
            </Link>
        </Tooltip>
    );

    return (
        <div className="flex">
            <nav className="flex flex-col items-center justify-between px-4 pb-4 border-r h-screen">
                <div>
                    <NavItem name="Dashboard" href="" icon={<House />} />
                    <NavItem name="Rooms" href="/rooms" icon={<Building />} />
                    <NavItem name="Schedules" href="/schedules" icon={<Calendar />} />
                </div>
                <div className="flex flex-col items-center gap-2">
                    <NavItem name="Settings" href="/settings" icon={<Settings />} />
                    <ThemeSwitch />
                </div>
            </nav>
            <div className="p-6">{children}</div>
        </div>
    );
}
