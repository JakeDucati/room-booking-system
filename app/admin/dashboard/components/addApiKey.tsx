"use client";

import crypto from "crypto";

import { useState, useEffect } from "react";
import { Button } from "@nextui-org/button";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Input,
  Tooltip,
} from "@nextui-org/react";
import { toast } from "react-toastify";
import { Copy } from "lucide-react";

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
  const [generatedKey, setGeneratedKey] = useState("");

  useEffect(() => {
    const fetchKey = async () => {
      const key = await getApiKey("admin");

      setApiKey(key);
    };

    fetchKey();

    setGeneratedKey(crypto.randomBytes(32).toString("hex"));
  }, []);

  const handleCopyKey = async () => {
    try {
      await navigator.clipboard.writeText(generatedKey);
      toast("API Key copied to clipboard!");
    } catch (error) {
      toast("Failed to copy API key");
    }
  };

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
              <div className="flex gap-2 items-center">
                <Tooltip content="Copy Key">
                  <Button isIconOnly variant="flat" onPress={handleCopyKey}>
                    <Copy />
                  </Button>
                </Tooltip>
                <Input isDisabled label="Key" value={generatedKey} />
              </div>
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
