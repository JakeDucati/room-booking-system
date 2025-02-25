"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Code, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Spinner, useDisclosure } from "@nextui-org/react";
import { CircleAlert } from "lucide-react";

export default function AdminDashboard() {
    // const router = useRouter();
    // const [isLoggedIn, setIsLoggedIn] = useState(false);

    // if (!isLoggedIn) return <Spinner />;

    return (
        <>
            <div>
                <h1>Dashboard</h1>
                <p>View all the data from here!</p>
            </div>
        </>
    );
}
