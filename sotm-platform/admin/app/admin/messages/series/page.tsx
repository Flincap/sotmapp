"use client";

import { API_URL } from "@/lib/api";
import { useState, useEffect, useCallback } from "react";
import { Series } from "@/lib/types";
import axios from "axios";
import { format } from "date-fns";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function SeriesPage() {
  const [series, setSeries] = useState<Series[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const access_token = localStorage.getItem("access_token");

  const fetchSeries = useCallback(async () => {
    setIsLoading(true);

    try {
      const response = await axios.get(
        `${API_URL}/series`,
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setSeries(response.data);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        toast.error(error.response.data.message || "Failed to fetch series");
      } else {
        toast.error("Failed to fetch series");
      }
      console.error("Error fetching series:", error);
    } finally {
      setIsLoading(false);
    }
  }, [access_token]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await axios.post(
        `${API_URL}/series/sync`,
        {},
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
            "Content-Type": "application/json",
          },
        }
      );
      await fetchSeries();
      toast.success("Series list refreshed successfully");
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        toast.error(error.response.data.message || "Failed to refresh series");
      } else {
        toast.error("Failed to refresh series");
      }
      console.error("Error refreshing series:", error);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    if (!access_token) {
      console.error("No auth token found");
      return;
    }
    fetchSeries();
  }, [access_token, fetchSeries]);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold">Series</h2>
          <p className="text-muted-foreground">
            View all series and their message counts
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
          {isRefreshing ? "Refreshing..." : "Refresh Series"}
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
                  Loading series...
                </td>
              </tr>
            ) : series.length === 0 ? (
              <tr>
                <td colSpan={3} className="p-2 text-center">
                  No series found
                </td>
              </tr>
            ) : (
              series.map((series) => (
                <tr
                  key={series._id}
                  className="border-b text-sm transition-colors hover:bg-muted/50"
                >
                  <td className="p-2">{series.title}</td>
                  <td className="p-2">{series.messageCount}</td>
                  <td className="p-2">
                    {format(new Date(series.updatedAt), "MMM d, yyyy HH:mm")}
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
