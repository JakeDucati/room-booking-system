"use client";

import { useState, useEffect } from "react";
import { Button } from "@nextui-org/button";
import {
  Code,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/react";
import { toast } from "react-toastify";

import { getApiKey } from "@/lib/apiKeys";

export default function DeleteRoomModal({
  isOpen,
  onOpenChange,
  room,
}: {
  isOpen: boolean;
  onOpenChange: () => void;
  room: {
    id: number;
    name: string;
    number: number;
    capacity: number;
  } | null;
}) {
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [id, setId] = useState<number>();

  useEffect(() => {
    const fetchKey = async () => {
      const key = await getApiKey("admin");

      setApiKey(key);
    };

    fetchKey();
  }, [room]);

  useEffect(() => {
    setId(room?.id);
  }, [room]);

  const handleDeleteRoom = async () => {
    if (!apiKey || !room) {
      toast("API Key not available or Room not found");

      return;
    }

    const formData = new FormData();

    formData.append("key", apiKey);
    formData.append("id", String(room.id));

    try {
      const response = await fetch("/api/deleteRoom", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();

        toast(errorData.error || "Failed to delete room");

        return;
      }

      toast(`Deleted Room: ${room.number}`);
      onOpenChange();
    } catch (error) {
      toast("Error deleting room");
    }
  };

  return (
    <Modal
      closeButton={false}
      isOpen={isOpen}
      size="xl"
      onOpenChange={onOpenChange}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex gap-2">Confirm Action</ModalHeader>
            <ModalBody>
              <p>Are you sure you want to permanently delete this room?</p>
              <p>All schedules bound to this room will also be deleted.</p>
              <p className="font-bold">This action cannot be undone!</p>
              <Code>
                <div>Name: {room?.name}</div>
                <div>Number: {room?.number}</div>
                <div>Capacity: {room?.capacity}</div>
                <div>ID: {room?.id}</div>
              </Code>
            </ModalBody>
            <ModalFooter>
              <Button color="primary" variant="flat" onPress={onClose}>
                Cancel
              </Button>
              <Button color="danger" onPress={handleDeleteRoom}>
                Delete
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
