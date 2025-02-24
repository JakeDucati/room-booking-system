"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Code, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Spinner, useDisclosure } from "@nextui-org/react";
import { CircleAlert } from "lucide-react";

export default function AdminDashboard() {
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

    if (!isLoggedIn) return <Spinner />;

    return (
        <>
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
            <div>
                <h1>Admin Dashboard</h1>
                <p>Welcome to the admin dashboard!</p>
            </div>
        </>
    );
}
