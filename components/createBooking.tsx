"use client";

import {
  Button,
  Calendar,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/react";
import { today, getLocalTimeZone } from "@internationalized/date";
import { useState } from "react";

export default function CreateBooking({
  roomNumber,
  isOpen,
  onOpenChange,
}: {
  roomNumber: number;
  isOpen: boolean;
  onOpenChange: () => void;
}) {
  const [room, setRoom] = useState<number | null>(roomNumber || null);
  const [scheduler, setScheduler] = useState("");
  const [host, setHost] = useState("");
  const [event, setEvent] = useState("");

  // CHECK THAT ROOM ISNT ALREADY BOOKED AT REQUESTED TIME

  const handleScheduleRoom = () => {

  }

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} isDismissable={false}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader>
              <h2>Create Booking</h2>
            </ModalHeader>
            <ModalBody>
              <div>
                <div>Room</div>
                <Input
                  label="Room #"
                  type="number"
                />
                <Calendar
                  defaultValue={today(getLocalTimeZone())}
                  minValue={today(getLocalTimeZone())}
                />
                <Input
                  label="Scheduler"
                  placeholder="Your Name"
                  isRequired
                />
                <Input
                  label="Host"
                  placeholder="Event Host"
                  isRequired
                />
                <Input
                  label="Event"
                  placeholder="eg. "
                  isRequired
                />
              </div>
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={onClose}>
                Cancel
              </Button>
              <Button color="primary" onPress={handleScheduleRoom}>
                Book
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
