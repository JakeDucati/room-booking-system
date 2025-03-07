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
} from "@nextui-org/react";
import { toast } from "react-toastify";

import { getApiKey } from "@/lib/apiKeys";

export default function AddApiKeyModal({
  isOpen,
  onOpenChange,
}: {
  isOpen: boolean;
  onOpenChange: () => void;
}) {
  const [keyName, setKeyName] = useState("");
  const [apiKey, setApiKey] = useState<string | null>(null);

  useEffect(() => {
    const fetchKey = async () => {
      const key = await getApiKey("admin");

      setApiKey(key);
    };

    fetchKey();
  }, []);

  const handleAddApiKey = async () => {
    if (!apiKey) {
      toast("API Key not available");

      return;
    }

    try {
      const response = await fetch("/api/apiKeys/addKey", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          key: apiKey,
          keyName,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast("Failed to add API key");

        return;
      }

      setKeyName("");

      onOpenChange();
    } catch (error) {
      toast("Error adding API key");
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
            <ModalHeader className="flex gap-2">Create API Key</ModalHeader>
            <ModalBody>
              <Input
                isRequired
                label="Key Name"
                value={keyName}
                onChange={(e) => setKeyName(e.target.value)}
              />
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="flat" onPress={onClose}>
                Cancel
              </Button>
              <Button color="primary" onPress={handleAddApiKey}>
                Create
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
