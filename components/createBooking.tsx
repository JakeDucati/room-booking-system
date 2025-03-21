"use client";

import {
  Button,
  Calendar,
  Image,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  TimeInput,
} from "@nextui-org/react";
import {
  today,
  getLocalTimeZone,
  Time,
  CalendarDate,
} from "@internationalized/date";
import { useState } from "react";
import { toast } from "react-toastify";

export default function CreateBooking({
  roomNumber,
  roomImageUrl,
  isOpen,
  onOpenChange,
}: {
  roomNumber: number;
  roomImageUrl: string;
  isOpen: boolean;
  onOpenChange: () => void;
}) {
  const [room, setRoom] = useState<number>(roomNumber);
  const [scheduler, setScheduler] = useState("");
  const [host, setHost] = useState("");
  const [event, setEvent] = useState("");
  const [startTime, setStartTime] = useState<Time | null>(null);
  const [endTime, setEndTime] = useState<Time | null>(null);
  const [date, setDate] = useState<CalendarDate>(today(getLocalTimeZone()));

  const handleScheduleRoom = async () => {
    try {
      if (!startTime || !endTime) {
        toast.error("Please select a start and end time.");

        return;
      }

      const formattedDate = date.toString();
      const startDateTime = new Date(
        `${formattedDate}T${startTime.toString()}`,
      );
      const endDateTime = new Date(`${formattedDate}T${endTime.toString()}`);

      console.log("Room: " + room);
      console.log("Start: " + startDateTime.toISOString());
      console.log("End: " + endDateTime.toISOString());
      console.log("Event: " + event);
      console.log("Host: " + host);
      console.log("Scheduler: " + scheduler);
      console.log("Date: " + formattedDate);

      const response = await fetch("/api/createBooking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          roomNumber: room,
          startTime: startDateTime.toISOString(),
          endTime: endDateTime.toISOString(),
          event,
          host,
          scheduler,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to book room");
      }

      toast.success(`Booked Room ${roomNumber}`);
      onOpenChange();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <Modal
      isDismissable={false}
      isOpen={isOpen}
      size="4xl"
      onOpenChange={onOpenChange}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader>
              <h2>Create Booking</h2>
            </ModalHeader>
            <ModalBody>
              <div className="flex justify-between gap-4">
                <div className="w-full flex flex-col gap-2">
                  <div>Details</div>
                  <div className="flex gap-2 justify-between">
                    <div className="w-full flex flex-col gap-2">
                      <Input
                        isRequired
                        label="Room #"
                        type="number"
                        value={room.toString()}
                        onChange={(e) => setRoom(Number(e.target.value))}
                      />
                      <Input
                        isRequired
                        label="Scheduler"
                        placeholder="Your Name"
                        value={scheduler}
                        onChange={(e) => setScheduler(e.target.value)}
                      />
                      <Input
                        isRequired
                        label="Host"
                        placeholder="Event Host"
                        value={host}
                        onChange={(e) => setHost(e.target.value)}
                      />
                    </div>
                    <Image
                      isBlurred
                      isZoomed
                      alt="photo of room"
                      className="h-[186px] min-w-[268px]"
                      src={roomImageUrl || "/default_room.jpg"}
                    />
                  </div>
                  <Input
                    isRequired
                    label="Event"
                    placeholder="eg. Board Meeting, Training Session, Team Building Activities, etc."
                    value={event}
                    onChange={(e) => setEvent(e.target.value)}
                  />
                  <div className="flex items-center gap-4">
                    <TimeInput
                      isRequired
                      label="Start Time"
                      value={startTime}
                      onChange={(e) => setStartTime(e)}
                    />
                    <div>-</div>
                    <TimeInput
                      isRequired
                      label="End Time"
                      value={endTime}
                      onChange={(e) => setEndTime(e)}
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <div>
                    <div className="mb-2">Date</div>
                    <Calendar
                      minValue={today(getLocalTimeZone())}
                      value={date}
                      onChange={setDate}
                    />
                  </div>
                </div>
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
