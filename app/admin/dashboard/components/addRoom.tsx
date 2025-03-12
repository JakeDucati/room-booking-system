"use client";

import { useState, useEffect } from "react";
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

import { getApiKey } from "@/lib/apiKeys";

export default function RoomModal({
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
  const [image, setImage] = useState<File | null>(null);
  const [apiKey, setApiKey] = useState<string | null>(null);

  useEffect(() => {
    const fetchKey = async () => {
      const key = await getApiKey("admin");

      setApiKey(key);
    };

    fetchKey();
  }, []);

  const handleAddRoom = async () => {
    if (!apiKey) {
      toast("API Key not available");

      return;
    }

    const formData = new FormData();

    formData.append("key", apiKey);
    formData.append("name", name);
    formData.append("roomNumber", roomNumber);
    formData.append("capacity", capacity);
    formData.append("features", JSON.stringify(features));
    formData.append("notes", notes);
    if (image) {
      formData.append("image", image);
    }

    try {
      const response = await fetch("/api/addRoom", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        toast("Failed to create room");

        return;
      }

      toast(`Created New Room: ${roomNumber}`);

      setName("");
      setRoomNumber("");
      setCapacity("");
      setNotes("");
      setFeatures([]);
      setImage(null);

      onOpenChange();
    } catch (error) {
      toast("Error creating room");
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
                  placeholder="e.g., Conference, Classroom"
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
                  label="Notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <Input
                  accept="image/png, image/jpeg, image/gif, image/webp"
                  label="Image"
                  type="file"
                  onChange={(e) => setImage(e.target.files?.[0] || null)}
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
