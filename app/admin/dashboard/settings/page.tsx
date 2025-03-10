"use client";

import { Button } from "@nextui-org/button";
import { Copy, Plus } from "lucide-react";
import { Card, Divider, Input, Tooltip, useDisclosure } from "@nextui-org/react";

import AddApiKeyModal from "../components/addApiKey";
import ViewApiKeyModal from "../components/viewApiKey";
import AdminDashboardHeader from "@/app/admin/dashboard/components/adminDashboardHeader";
import { useEffect, useState } from "react";
import { getApiKey } from "@/lib/apiKeys";
import { toast } from "react-toastify";

export default function AdminDashboardSettings() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const viewDisclosure = useDisclosure();
  const [apiKeys, setApiKeys] = useState<{ keyName: string; apiKey: string }[]>([]);
  const [selectedApiKey, setSelectedApiKey] = useState<{ keyName: string; apiKey: string } | null>(null);
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
          console.error("Error:", data.error);
        }
      } catch (error) {
        console.error("Failed to fetch API keys:", error);
      }
    };

    fetchAdminKey();
  }, []);

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

  const OptionsItem = ({ label, children }: { label: string; children: React.ReactNode }) => {
    return (
      <div className="flex justify-between items-center">
        <div>{label}</div>
        {children}
      </div>
    );
  }

  return (
    <>
      <AdminDashboardHeader text="Settings">
        <></>
      </AdminDashboardHeader>
      <AddApiKeyModal isOpen={isOpen} onOpenChange={onOpenChange} />
      {selectedApiKey && (
        <ViewApiKeyModal
          isOpen={viewDisclosure.isOpen}
          onOpenChange={viewDisclosure.onOpenChange}
          apiKey={selectedApiKey.apiKey}
          keyName={selectedApiKey.keyName}
        />
      )}
      <div className="flex flex-col">
        <div className="flex gap-4">
          <div className="w-1/2">
            <div className="flex items-center justify-between">
              <div className="text-xl font-bold">General</div>
            </div>
            <div className="flex flex-col gap-4">
              <OptionsItem label="Pending Room Timeout">
                <Input
                  className="w-24"
                  label="Minutes"
                />
              </OptionsItem>
            </div>
          </div>
          <Divider orientation="vertical" className="min-h-[calc(100vh-100px)]" />
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
                  onPress={() => handleOpenViewModal(keyName, apiKey)} // Open modal on card click
                >
                  <div className="flex justify-between items-center p-4 w-full">
                    <div>{keyName}</div>
                    <Tooltip content="Copy Key">
                      <Button isIconOnly variant="flat" onPress={() => copyKey(apiKey)}>
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
