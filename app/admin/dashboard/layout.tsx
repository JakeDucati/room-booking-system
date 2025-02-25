"use client";

import { ThemeSwitch } from "@/components/theme-switch";
import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Spinner, Tooltip, useDisclosure } from "@nextui-org/react";
import { Building, Calendar, CircleAlert, Code, House, LogOut, Settings } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AdminDashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    useEffect(() => {
        const loggedIn = localStorage.getItem("adminLoggedIn");
        if (!loggedIn) {
            router.push("/admin/login");
        } else {
            setIsLoggedIn(true);
        }
    }, []);

    useEffect(() => {
        if (process.env.NEXT_PUBLIC_ADMIN_PASSWD === "Change This") {
            onOpen();
        }
    }, []);

    const NavItem = ({ name, href, icon }: { name: string; href: string; icon: React.ReactNode }) => (
        <Tooltip content={name} placement="right">
            <Link href={`/admin/dashboard${href}`} className="p-2">
                {icon}
            </Link>
        </Tooltip>
    );

    const handleLogout = () => {
        localStorage.removeItem('adminLoggedIn');
        router.push('/admin/login');
    };

    if (!isLoggedIn) { return (<Spinner />) }

    return (
        <div className="flex">
            <Modal isOpen={isOpen} onOpenChange={onOpenChange} isDismissable={false} closeButton={false}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex gap-2">
                                <CircleAlert className="text-danger" /> WARNING
                            </ModalHeader>
                            <ModalBody>
                                <p>
                                    You are currently using the default admin password. This is unsafe as it can be easily
                                    guessed by malicious users. Update the password in the <Code>.env.local</Code> file to a
                                    unique and secure password to protect the dashboard.
                                </p>
                            </ModalBody>
                            <ModalFooter>
                                <Button color="primary" onPress={onClose}>
                                    I Understand
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
            <nav className="flex flex-col items-center justify-between px-4 pb-4 border-r h-screen">
                <div>
                    <NavItem name="Dashboard" href="" icon={<House />} />
                    <NavItem name="Rooms" href="/rooms" icon={<Building />} />
                    <NavItem name="Schedules" href="/schedules" icon={<Calendar />} />
                </div>
                <div className="flex flex-col items-center gap-2">
                    <NavItem name="Settings" href="/settings" icon={<Settings />} />
                    <ThemeSwitch />
                    <Tooltip content="Logout" placement="right">
                        <Button onPress={handleLogout} isIconOnly variant="light"><LogOut /></Button>
                    </Tooltip>
                </div>
            </nav>
            <div className="p-6">{children}</div>
        </div>
    );
}
