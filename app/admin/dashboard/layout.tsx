"use client";

import {
  Button,
  Code,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Spinner,
  Tooltip,
  useDisclosure,
} from "@nextui-org/react";
import {
  Building,
  Calendar,
  CircleAlert,
  House,
  LogOut,
  Settings,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { ThemeSwitch } from "@/components/theme-switch";

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

  const NavItem = ({
    name,
    href,
    icon,
  }: {
    name: string;
    href: string;
    icon: React.ReactNode;
  }) => (
    <Tooltip content={name} placement="right">
      <Link className="scale-110" href={`/admin/dashboard${href}`}>
        {icon}
      </Link>
    </Tooltip>
  );

  const handleLogout = () => {
    localStorage.removeItem("adminLoggedIn");
    router.push("/admin/login");
  };

  if (!isLoggedIn) {
    return <Spinner />;
  }

  return (
    <div className="flex">
      <Modal
        closeButton={false}
        isDismissable={false}
        isOpen={isOpen}
        onOpenChange={onOpenChange}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex gap-2">
                <CircleAlert className="text-danger" /> WARNING
              </ModalHeader>
              <ModalBody>
                <p>
                  You are currently using the default admin password. This
                  password is not safe for production use! Update the password
                  in the <Code>.env.local</Code> file to a unique and secure
                  password.
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
        <div className="flex flex-col gap-6 pt-6">
          <NavItem href="" icon={<House />} name="Dashboard" />
          <NavItem href="/rooms" icon={<Building />} name="Rooms" />
          <NavItem href="/schedules" icon={<Calendar />} name="Schedules" />
        </div>
        <div className="flex flex-col items-center gap-6">
          <NavItem href="/settings" icon={<Settings />} name="Settings" />
          <ThemeSwitch />
          <Tooltip content="Logout" placement="right">
            <Button isIconOnly variant="light" onPress={handleLogout}>
              <LogOut />
            </Button>
          </Tooltip>
        </div>
      </nav>
      <div className="p-6 w-full max-h-[calc(100vh-49px)]">{children}</div>
    </div>
  );
}
