"use client";

import { useState } from "react";
import { Button } from "@nextui-org/button";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Input,
  Checkbox,
  CheckboxGroup,
} from "@nextui-org/react";
import { toast } from "react-toastify";

export default function EditRoom({
  isOpen,
  onOpenChange,
}: {
  isOpen: boolean;
  onOpenChange: () => void;
}) {
  const [name, setName] = useState("");
  const [roomNumber, setRoomNumber] = useState("");
  const [capacity, setCapacity] = useState("");
  const [notes, setNotes] = useState("");
  const [features, setFeatures] = useState<string[]>([]);

  const key = process.env.NEXT_PUBLIC_API_KEY_ADMIN;

  const handleAddRoom = async () => {
    try {
      // call api to add room to db
      const response = await fetch("/api/addRoom", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          key,
          name,
          roomNumber,
          capacity,
          features,
          notes,
        }),
      });

      if (!response.ok) {
        toast("Failed to create room");
      }

      const newRoom = await response.json();

      toast(`Created New Room: ${roomNumber}`);

      // reset feilds
      setName("");
      setRoomNumber("");
      setCapacity("");
      setNotes("");
      setFeatures([]);

      onOpenChange();
    } catch (error) {
      toast("Error adding room!");
    }
  };

  return (
    <Modal
      closeButton={false}
      isDismissable={false}
      isOpen={isOpen}
      size="xl"
      onOpenChange={onOpenChange}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex gap-2">Add Room</ModalHeader>
            <ModalBody>
              <div>General Info</div>
              <div className="flex gap-2">
                <Input
                  isRequired
                  label="Name"
                  placeholder="eg. Conference, Classroom, Theater, etc."
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <Input
                  isRequired
                  className="w-36"
                  label="Room #"
                  value={roomNumber}
                  onChange={(e) => setRoomNumber(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <Input
                  isRequired
                  className="w-36"
                  label="Capacity"
                  value={capacity}
                  onChange={(e) => setCapacity(e.target.value)}
                />
                <Input
                  label="Additional Notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>
              <div>Features</div>
              <CheckboxGroup value={features} onValueChange={setFeatures}>
                <Checkbox value="av_equipment">A/V Equipment</Checkbox>
                <Checkbox value="video_conferencing">
                  Video Conferencing
                </Checkbox>
                <Checkbox value="climate_controls">Climate Controls</Checkbox>
                <Checkbox value="device_charging">Device Charging</Checkbox>
              </CheckboxGroup>
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="flat" onPress={onClose}>
                Cancel
              </Button>
              <Button color="primary" onPress={handleAddRoom}>
                Add
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
