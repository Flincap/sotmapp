"use client";

import { API_URL } from "@/lib/api";
import MessagesTable from "@/components/admin/messages-table";
import { useState, useEffect } from "react";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function MessagesPage() {
  const [messagesCount, setMessagesCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchMessagesCount();
  }, []);

  async function fetchMessagesCount() {
    try {
      setIsLoading(true);
      const access_token = localStorage.getItem("access_token");

      if (!access_token) {
        console.error("No auth token found");
        return;
      }

      const response = await fetch(
        `${API_URL}/messages/stats`,
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch stats: ${response.status}`);
      }

      const data = await response.json();
      setMessagesCount(data.totalMessages || 0);
    } catch (error) {
      console.error("Error fetching messages count:", error);
      setMessagesCount(0);
      toast.error("Failed to fetch messages count");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="h-full flex flex-col">
      <div className="shrink-0 flex items-center justify-between py-4">
        <div className="flex items-center gap-4">
          <h3 className="text-lg font-semibold">Uploaded Messages</h3>
          <div className="flex items-center gap-2 bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-sm">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500" />
            {(messagesCount || 0).toLocaleString()} total
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            className="flex items-center gap-2"
            onClick={fetchMessagesCount}
            disabled={isLoading}
          >
            {isLoading && <RefreshCw size={12} className="animate-spin" />}
            {isLoading ? (
              "Refreshing..."
            ) : (
              <>
                <RefreshCw size={12} />
                Refresh
              </>
            )}
          </Button>
        </div>
      </div>
      <div className="flex-1 min-h-0">
        {" "}
        {/* This ensures the table container doesn't exceed viewport */}
        <MessagesTable />
      </div>
    </div>
  );
}
