import { Button } from "@nextui-org/button";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@nextui-org/react";
import { Calendar, Clock, User } from "lucide-react";

interface Booking {
  id: number;
  roomId: number;
  startTime: string;
  endTime: string;
  event: string;
  host: string;
  scheduler: string;
  createdAt: string;
}

export default function BookingDetails({
  isOpen,
  onOpenChange,
  selectedBooking,
}: {
  isOpen: boolean;
  onOpenChange: () => void;
  selectedBooking: Booking | null;
}) {
  const formatToLocalTime = (dateString: string) => {
    const date = new Date(dateString);

    return new Intl.DateTimeFormat(navigator.language, {
      month: "numeric",
      day: "numeric",
      year: "2-digit",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    }).format(date);
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              {selectedBooking ? selectedBooking.event : "Details"}
            </ModalHeader>
            <ModalBody>
              {selectedBooking ? (
                <>
                  <div className="flex items-center gap-2">
                    <Clock />
                    {formatToLocalTime(selectedBooking.startTime)} -{" "}
                    {formatToLocalTime(selectedBooking.endTime)}
                  </div>
                  <div className="flex items-center gap-2">
                    <User />
                    Host: {selectedBooking.host}
                  </div>
                  <div className="flex items-center gap-2">
                    <User />
                    Scheduler: {selectedBooking.scheduler}
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar />
                    Scheduled at {formatToLocalTime(selectedBooking.createdAt)}
                  </div>
                </>
              ) : (
                <p>No booking selected.</p>
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
