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
  useDisclosure,
} from "@nextui-org/react";
import { today, getLocalTimeZone } from "@internationalized/date";

export default function CreateBooking() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent>
        {(onClose) => (
          <form>
            <ModalHeader>
              <h2>Create Booking</h2>
            </ModalHeader>
            <ModalBody>
              <div>
                <div>Room</div>
                <Input
                  type="number"
                />
                <Calendar
                  defaultValue={today(getLocalTimeZone())}
                  minValue={today(getLocalTimeZone())}
                />
              </div>
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={onClose}>
                Close
              </Button>
              <Button color="primary" onPress={onClose}>
                Action
              </Button>
            </ModalFooter>
          </form>
        )}
      </ModalContent>
    </Modal>
  );
}
