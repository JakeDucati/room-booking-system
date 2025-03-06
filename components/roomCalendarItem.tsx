import { Button } from "@nextui-org/button";
import { Tooltip, Card } from "@nextui-org/react";
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
}

export default function RoomCalendarItem({
  room,
  onPress,
}: {
  room: Room;
  onPress: (room: Room) => void;
}) {
  const featureIcons = {
    av_equipment: {
      tooltip: (
        <Tooltip content="A/V Equipment">
          <Projector />
        </Tooltip>
      ),
    },
    video_conferencing: {
      tooltip: (
        <Tooltip content="Video Conferencing">
          <Video />
        </Tooltip>
      ),
    },
    climate_controls: {
      tooltip: (
        <Tooltip content="Climate Controls">
          <AirVent />
        </Tooltip>
      ),
    },
    device_charging: {
      tooltip: (
        <Tooltip content="Device Charging">
          <Plug />
        </Tooltip>
      ),
    },
  };

  const features = room.features ? room.features.split(",") : [];

  return (
    <div className="flex h-18 border-y p-1 w-[4700px]">
      <div className="w-72 border-r mr-1 flex justify-between sticky left-1 gap-2 z-10 bg-background">
        <div className="w-full flex flex-col gap-2">
          <div className="text-xl">
            {room.name} {room.number}
          </div>
          <div className="text-sm -mt-1 flex items-center gap-2 justify-between">
            <div className="flex items-center -ml-1">
              <Tooltip content="Capacity">
                <User />
              </Tooltip>
              {room.capacity}
            </div>
            <div className="flex items-center gap-1">
              {features.map((feature) => {
                // @ts-ignore
                const featureData = featureIcons[feature.trim()];

                return featureData ? (
                  <div key={feature} className="flex gap-2">
                    {featureData.tooltip}
                  </div>
                ) : null;
              })}
            </div>
          </div>
        </div>
        <div className="flex items-center pr-3">
          <Tooltip content="Book Room" placement="right">
            <Button isIconOnly>
              <Plus />
            </Button>
          </Tooltip>
        </div>
      </div>
      <Card
        isHoverable
        isPressable
        className="p-1 cursor-pointer"
        onPress={() => onPress(room)}
      >
        <div>Host: {room.host}</div>
        <div>
          {room.start} - {room.end}
        </div>
      </Card>
    </div>
  );
}
