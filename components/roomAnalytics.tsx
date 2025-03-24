"use client";

import { Card } from "@nextui-org/react";
import { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { toast } from "react-toastify";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

export default function RoomAnalytics({
  showAllRooms = false,
}: {
  showAllRooms?: boolean;
}) {
  const [rooms, setRooms] = useState<
    {
      id: number;
      name: string;
      number: number;
      capacity: number;
      image: string;
    }[]
  >([]);
  const [selectedRoom, setSelectedRoom] = useState<{
    id: number;
    name: string;
    number: number;
    capacity: number;
    notes: string;
    features: string;
    image: string;
  } | null>(null);
  const [bookingData, setBookingData] = useState<number[]>([]);
  const [labels, setLabels] = useState<string[]>([]);

  useEffect(() => {
    fetch("/api/rooms")
      .then((res) => res.json())
      .then((data) => setRooms(data))
      .catch((err) => toast.error("Failed to fetch rooms"));
  }, []);

  const fetchBookingData = (roomId?: number) => {
    const url = roomId
      ? `/api/analytics?roomId=${roomId}`
      : "/api/analytics?all=true";

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        const bookingCounts = Array(31).fill(0);
        const dayLabels = Array.from({ length: 31 }, (_, i) => `${i + 1}`);

        data.forEach((booking: any) => {
          const bookingDate = new Date(booking.startTime);
          const dayOfMonth = bookingDate.getDate();

          if (dayOfMonth >= 1 && dayOfMonth <= 31) {
            bookingCounts[dayOfMonth - 1] += 1;
          }
        });

        setBookingData(bookingCounts);
        setLabels(dayLabels);
      })
      .catch((err) => toast.error("Failed to fetch bookings"));
  };

  useEffect(() => {
    if (showAllRooms) {
      fetchBookingData();
    }
  }, [showAllRooms]);

  return (
    <section className="mt-4">
      {!showAllRooms && (
        <div className="overflow-x-scroll flex gap-4 mx-4 py-2">
          {rooms.map((room) => (
            <Card
              key={room.id}
              isHoverable
              isPressable
              className={`p-3 ${selectedRoom?.id === room.id ? "border border-primary" : ""}`}
              onClick={() => {
                // @ts-ignore
                setSelectedRoom(room);
                fetchBookingData(room.id);
              }}
            >
              <div className="font-semibold">
                {room.number} {room.name}
              </div>
            </Card>
          ))}
        </div>
      )}

      {showAllRooms || selectedRoom ? (
        <div className="mt-8 w-3/4 mx-auto">
          <div>
            {showAllRooms ? "Total Bookings This Month" : "Bookings This Month"}
          </div>
          <Bar
            data={{
              labels: labels,
              datasets: [
                {
                  label: "Bookings",
                  data: bookingData,
                  backgroundColor: "rgba(75, 192, 192, 0.2)",
                  borderColor: "rgba(75, 192, 192, 1)",
                  borderWidth: 1,
                },
              ],
            }}
            options={{
              responsive: true,
              scales: {
                x: {
                  title: {
                    display: true,
                    text: "Day of the Month",
                  },
                },
                y: {
                  beginAtZero: true,
                  ticks: {
                    stepSize: 1,
                    precision: 0,
                  },
                  title: {
                    display: true,
                    text: "Number of Bookings",
                  },
                },
              },
            }}
          />
        </div>
      ) : null}
    </section>
  );
}
