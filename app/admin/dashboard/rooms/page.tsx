"use client";

import { Button } from "@nextui-org/button";
import {
  Card,
  Image,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react";
import { Plus, Trash2 } from "lucide-react";

import AdminDashboardHeader from "@/components/adminDashboardHeader";

export default function AdminDashboardRooms() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <>
      <Modal
        closeButton={false}
        isDismissable={false}
        isOpen={isOpen}
        onOpenChange={onOpenChange}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex gap-2">Add Room</ModalHeader>
              <ModalBody>
                <p>fdsfsddsf</p>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="flat" onPress={onClose}>
                  Cancel
                </Button>
                <Button color="primary" onPress={onClose}>
                  Add
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
      <AdminDashboardHeader text="Rooms">
        <Button onPress={onOpen}>
          <Plus /> <span>Add Room</span>
        </Button>
      </AdminDashboardHeader>
      <div className="flex gap-6 h-full">
        <div className="w-full flex flex-col gap-1 py-2">
          <Card isHoverable className="p-3" onPress={onOpen}>
            <div className="flex justify-between">
              <div>
                <div>Room Name</div>
                <div>Capacity</div>
              </div>
              <div className="flex gap-4 items-center">
                <div>status</div>
                <Button isIconOnly>
                  <Trash2 />
                </Button>
              </div>
            </div>
          </Card>
        </div>
        <div className="border-l w-1/3 min-w-96 pl-4 h-full flex flex-col gap-2">
          <Image isBlurred isZoomed src="/default_room.jpg" />
          <div>
            <div className="text-2xl">Room Name</div>
            <div>Capacity</div>
          </div>
        </div>
      </div>
    </>
  );
}
