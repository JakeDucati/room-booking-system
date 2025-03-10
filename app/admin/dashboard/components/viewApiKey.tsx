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

  return (
    <Modal
      isOpen={isOpen}
      size="xl"
      onOpenChange={onOpenChange}
    >
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
              <Button color="danger" variant="flat" onPress={onClose}>
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
