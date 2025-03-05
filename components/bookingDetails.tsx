import { Button } from "@nextui-org/button";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@nextui-org/react";

export default function BookingDetails({
  isOpen,
  onOpenChange,
  selectedRoom,
}: {
  isOpen: boolean;
  onOpenChange: () => void;
  selectedRoom: any;
}) {
  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              Booking Details | {selectedRoom?.name} {selectedRoom?.number}
            </ModalHeader>
            <ModalBody>
              {selectedRoom && (
                <>
                  <p>
                    <strong>Type:</strong> {selectedRoom.name}
                  </p>
                  <p>
                    <strong>Host:</strong> {selectedRoom.host}
                  </p>
                  <p>
                    <strong>Capacity:</strong> {selectedRoom.capacity}
                  </p>
                  <p>
                    <strong>Schedule:</strong> {selectedRoom.start} -{" "}
                    {selectedRoom.end}
                  </p>
                </>
              )}
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={onClose}>
                Close
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
