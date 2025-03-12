"use client";

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
import { Copy, Trash2 } from "lucide-react";

export default function ViewApiKeyModal({
  isOpen,
  onOpenChange,
  apiKey,
  keyName,
}: {
  isOpen: boolean;
  onOpenChange: () => void;
  apiKey: string;
  keyName: string;
}) {
  async function copyKey() {
    try {
      await navigator.clipboard.writeText(apiKey);
      toast("API Key copied to clipboard!");
    } catch (err) {
      toast("Failed to copy API key");
    }
  }

  async function handleDeleteKey() {
    try {
      const response = await fetch("/api/apiKeys/removeKey", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ key: apiKey, keyName }),
      });

      if (!response.ok) {
        toast("Failed to remove API key");

        return;
      }

      toast(`Removed API Key ${keyName}`);
      onOpenChange();
    } catch (err) {
      toast("Error removing API key");
    }
  }

  return (
    <Modal isOpen={isOpen} size="xl" onOpenChange={onOpenChange}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex gap-2">API Key</ModalHeader>
            <ModalBody>
              <Input isDisabled label="Key Name" value={keyName} />
              <div className="flex gap-2 items-center">
                <Tooltip content="Copy Key">
                  <Button isIconOnly variant="flat" onPress={copyKey}>
                    <Copy />
                  </Button>
                </Tooltip>
                <Input isDisabled label="Key" value={apiKey} />
              </div>
            </ModalBody>
            <ModalFooter className="flex justify-between">
              <Button color="danger" variant="flat" onPress={handleDeleteKey}>
                <Trash2 /> Delete
              </Button>
              <Button variant="flat" onPress={onClose}>
                Close
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
