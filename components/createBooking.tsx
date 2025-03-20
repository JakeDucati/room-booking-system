"use client";

import {
  Button,
  Calendar,
  DateRangePicker,
  Image,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  TimeInput,
} from "@nextui-org/react";
import { today, getLocalTimeZone, Time, CalendarDate } from "@internationalized/date";
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
      const startDateTime = new Date(`${formattedDate}T${startTime.toString()}`);
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
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} isDismissable={false} size="4xl">
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
                        label="Room #"
                        value={room.toString()}
                        onChange={(e) => setRoom(Number(e.target.value))}
                        type="number"
                        isRequired
                      />
                      <Input
                        label="Scheduler"
                        placeholder="Your Name"
                        value={scheduler}
                        onChange={(e) => setScheduler(e.target.value)}
                        isRequired
                      />
                      <Input
                        label="Host"
                        placeholder="Event Host"
                        value={host}
                        onChange={(e) => setHost(e.target.value)}
                        isRequired
                      />
                    </div>
                    <Image
                      className="h-[186px] min-w-[268px]"
                      isBlurred
                      isZoomed
                      alt="photo of room"
                      src={roomImageUrl || "/default_room.jpg"}
                    />
                  </div>
                  <Input
                    label="Event"
                    placeholder="eg. Board Meeting, Training Session, Team Building Activities, etc."
                    value={event}
                    onChange={(e) => setEvent(e.target.value)}
                    isRequired
                  />
                  <div className="flex items-center gap-4">
                    <TimeInput
                      label="Start Time"
                      value={startTime}
                      onChange={(e) => setStartTime(e)}
                      isRequired
                    />
                    <div>-</div>
                    <TimeInput
                      label="End Time"
                      value={endTime}
                      onChange={(e) => setEndTime(e)}
                      isRequired
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
