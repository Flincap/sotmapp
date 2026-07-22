"use client";

import { API_URL } from "@/lib/api";
import { useState, useEffect, useCallback } from "react";
import { Speaker } from "@/lib/types";
import axios from "axios";
import { format } from "date-fns";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function SpeakersPage() {
  const [speakers, setSpeakers] = useState<Speaker[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const access_token = localStorage.getItem("access_token");

  const fetchSpeakers = useCallback(async () => {
    setIsLoading(true);

    try {
      const response = await axios.get(
        `${API_URL}/speakers`,
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setSpeakers(response.data);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        toast.error(error.response.data.message || "Failed to fetch speakers");
      } else {
        toast.error("Failed to fetch speakers");
      }
      console.error("Error fetching speakers:", error);
    } finally {
      setIsLoading(false);
    }
  }, [access_token]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await axios.post(
        `${API_URL}/speakers/sync`,
        {},
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
            "Content-Type": "application/json",
          },
        }
      );
      await fetchSpeakers();
      toast.success("Speakers list refreshed successfully");
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        toast.error(
          error.response.data.message || "Failed to refresh speakers"
        );
      } else {
        toast.error("Failed to refresh speakers");
      }
      console.error("Error refreshing speakers:", error);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    if (!access_token) {
      console.error("No auth token found");
      return;
    }
    fetchSpeakers();
  }, [access_token, fetchSpeakers]);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold">Speakers</h2>
          <p className="text-muted-foreground">
            View all speakers and their message counts
          </p>
        </div>
        <Button
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="flex items-center gap-2"
        >
          <RefreshCw
            size={16}
            className={`${isRefreshing ? "animate-spin" : ""}`}
          />
          {isRefreshing ? "Refreshing..." : "Refresh Speakers"}
        </Button>
      </div>

      <div className="rounded-md">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr className="text-left text-sm">
              <th className="p-2 font-medium">Name</th>
              <th className="p-2 font-medium">Message Count</th>
              <th className="p-2 font-medium">Last Updated</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={3} className="p-2 text-center">
                  Loading speakers...
                </td>
              </tr>
            ) : speakers.length === 0 ? (
              <tr>
                <td colSpan={3} className="p-2 text-center">
                  No speakers found
                </td>
              </tr>
            ) : (
              speakers.map((speaker) => (
                <tr
                  key={speaker._id}
                  className="border-b text-sm transition-colors hover:bg-muted/50"
                >
                  <td className="p-2">{speaker.name}</td>
                  <td className="p-2">{speaker.messageCount}</td>
                  <td className="p-2">
                    {format(new Date(speaker.updatedAt), "MMM d, yyyy HH:mm")}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
