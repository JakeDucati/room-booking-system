"use client";

import { Button } from "@nextui-org/button";
import { Copy, HelpCircle, Plus } from "lucide-react";
import {
  Card,
  Divider,
  Input,
  Tooltip,
  useDisclosure,
} from "@nextui-org/react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import AddApiKeyModal from "../components/addApiKey";
import ViewApiKeyModal from "../components/viewApiKey";

import AdminDashboardHeader from "@/app/admin/dashboard/components/adminDashboardHeader";
import { getApiKey } from "@/lib/apiKeys";

export default function AdminDashboardSettings() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const viewDisclosure = useDisclosure();
  const [apiKeys, setApiKeys] = useState<{ keyName: string; apiKey: string }[]>(
    [],
  );
  const [selectedApiKey, setSelectedApiKey] = useState<{
    keyName: string;
    apiKey: string;
  } | null>(null);
  const [adminKey, setAdminKey] = useState<string | null>(null);

  useEffect(() => {
    const fetchAdminKey = async () => {
      const key = await getApiKey("admin");

      setAdminKey(key);

      if (key) {
        fetchKeys(key);
      }
    };

    const fetchKeys = async (key: string) => {
      try {
        const response = await fetch("/api/apiKeys/getKeys", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ key }),
        });

        const data = await response.json();

        if (response.ok) {
          setApiKeys(data.keys);
        } else {
          toast("Error");
        }
      } catch (error) {
        toast("Failed to get API Keys");
      }
    };

    fetchAdminKey();
  }, [onOpenChange]);

  async function copyKey(key: string) {
    try {
      await navigator.clipboard.writeText(key);
      toast("API Key copied to clipboard!");
    } catch (err) {
      toast("Failed to copy API key");
    }
  }

  const handleOpenViewModal = (keyName: string, apiKey: string) => {
    setSelectedApiKey({ keyName, apiKey });
    viewDisclosure.onOpen();
  };

  const OptionsItem = ({
    label,
    children,
    tooltip,
  }: {
    label: string;
    children: React.ReactNode;
    tooltip: string;
  }) => {
    return (
      <div className="flex justify-between items-center">
        <div className="flex gap-2">
          {label}{" "}
          <Tooltip className="max-w-64" content={tooltip} placement="right">
            <HelpCircle />
          </Tooltip>
        </div>
        {children}
      </div>
    );
  };

  return (
    <>
      <AdminDashboardHeader text="Settings">
        <></>
      </AdminDashboardHeader>
      <AddApiKeyModal isOpen={isOpen} onOpenChange={onOpenChange} />
      {selectedApiKey && (
        <ViewApiKeyModal
          apiKey={selectedApiKey.apiKey}
          isOpen={viewDisclosure.isOpen}
          keyName={selectedApiKey.keyName}
          onOpenChange={viewDisclosure.onOpenChange}
        />
      )}
      <div className="flex flex-col">
        <div className="flex gap-4">
          <div className="w-1/2">
            <div className="flex items-center justify-between">
              <div className="text-xl font-bold">General</div>
            </div>
            <div className="flex flex-col gap-4">
              <OptionsItem
                label="Pending Room Timeout"
                tooltip="Time until room is released from its schedule when in a pending state (no-show)."
              >
                <Input className="w-36" label="Minutes" type="number" />
              </OptionsItem>
            </div>
          </div>
          <Divider
            className="min-h-[calc(100vh-100px)]"
            orientation="vertical"
          />
          <div className="w-1/2">
            <div className="flex items-center justify-between">
              <div className="text-xl font-bold">API Keys</div>
              <Button onPress={onOpen}>
                <Plus /> New Key
              </Button>
            </div>
            <div className="flex flex-col gap-2 mt-4">
              {apiKeys.map(({ keyName, apiKey }) => (
                <Card
                  key={keyName}
                  isHoverable
                  isPressable
                  onPress={() => handleOpenViewModal(keyName, apiKey)}
                >
                  <div className="flex justify-between items-center p-4 w-full">
                    <div>{keyName}</div>
                    <Tooltip content="Copy Key">
                      <Button
                        isIconOnly
                        variant="flat"
                        onPress={() => copyKey(apiKey)}
                      >
                        <Copy />
                      </Button>
                    </Tooltip>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
