import { useEffect, useState } from "react";
import { Card, Tooltip, Button, Spinner } from "@nextui-org/react";
import { Projector, Video, AirVent, Plug, User, Plus } from "lucide-react";

interface Room {
  number: number;
  status: string;
  start: string;
  end: string;
  host: string;
  name: string;
  capacity: number;
  features: string;
  id: number;
}

interface Booking {
  id: number;
  roomId: number;
  startTime: string;
  endTime: string;
}

export default function RoomCalendarItem({
  room,
  onPress,
  timeSlots,
}: {
  room: Room;
  onPress: (room: Room) => void;
  timeSlots: string[];
}) {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await fetch(`/api/bookings?roomId=${room.id}`);
        const data = await response.json();
        setBookings(data);
      } catch (error) {
        console.error("Error fetching bookings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [room.id]);

  const featureIcons = {
    av_equipment: <Tooltip content="A/V Equipment"><Projector /></Tooltip>,
    video_conferencing: <Tooltip content="Video Conferencing"><Video /></Tooltip>,
    climate_controls: <Tooltip content="Climate Controls"><AirVent /></Tooltip>,
    device_charging: <Tooltip content="Device Charging"><Plug /></Tooltip>,
  };

  const features = room.features ? room.features.split(",") : [];

  const timeSlotDates = timeSlots.map((slot) => {
    const [dateStr, timeStr, period] = slot.split(" ");
    const [month, day, year] = dateStr.split("/").map(Number);
    let [hour, minute] = timeStr.split(":").map(Number);

    if (period === "PM" && hour !== 12) hour += 12;
    if (period === "AM" && hour === 12) hour = 0;

    const localDate = new Date(2000 + year, month - 1, day, hour, minute);
    return new Date(localDate.toLocaleString()); // Ensure the time slot is in local time
  });

  const bookingBlocks = bookings.map((booking) => {
    // Convert start and end time to local time
    const startDate = new Date(booking.startTime);
    const endDate = new Date(booking.endTime);

    // Adjust startDate and endDate to local time
    const localStartDate = new Date(startDate.toLocaleString()); // Converts to local time
    const localEndDate = new Date(endDate.toLocaleString()); // Converts to local time

    // Find the corresponding time slot indices
    const startIndex = timeSlotDates.findIndex(
      (slot) => slot.getTime() === localStartDate.getTime()
    );
    const endIndex = timeSlotDates.findIndex(
      (slot) => slot.getTime() === localEndDate.getTime()
    );

    if (startIndex === -1 || endIndex === -1) return null;

    const leftPosition = startIndex * 260; // Adjust this value if necessary
    const width = (endIndex - startIndex) * 260;

    return (
      <Card
        key={booking.id}
        isHoverable
        isPressable
        className="absolute p-2 bg-default"
        style={{
          left: `${leftPosition}px`,
          width: `${width}px`,
          height: "100%",
        }}
      >
        <div className="flex flex-col text-left w-full">
          <div>{booking.id}</div>
          <div>
            {localStartDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: true })} - {" "}
            {localEndDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: true })}
          </div>
        </div>
      </Card>
    );
  });

  return (
    <div className="relative flex h-18 border-y p-1" style={{ width: `${timeSlots.length * 120}px` }}>
      <div className="w-72 border-r mr-1 flex justify-between sticky left-1 gap-2 z-10 bg-background">
        <div className="w-full flex flex-col gap-2">
          <div className="text-xl">{room.name} {room.number}</div>
          <div className="text-sm -mt-1 flex items-center gap-2 justify-between">
            <div className="flex items-center -ml-1">
              <Tooltip content="Capacity">
                <User />
              </Tooltip>
              {room.capacity}
            </div>
            <div className="flex items-center gap-1">
              {features.map((feature) => (
                <div key={feature} className="flex gap-2">
                  {
                    // @ts-ignore
                    featureIcons[feature.trim()] || null
                  }
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="flex items-center pr-3">
          <Tooltip content={`Book Room ${room.number}`} placement="right">
            <Button isIconOnly>
              <Plus />
            </Button>
          </Tooltip>
        </div>
      </div>

      <div className="relative flex w-full">
        {loading ? <Spinner size="sm" className="absolute left-2" /> : bookingBlocks}
      </div>
    </div>
  );
}
