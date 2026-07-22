"use client";

import { API_URL } from "@/lib/api";
import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { format } from "date-fns";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

type Category = {
  _id: string;
  name: string;
  messageCount: number;
  updatedAt: string;
};

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const access_token = localStorage.getItem("access_token");

  const fetchCategories = useCallback(async () => {
    setIsLoading(true);

    try {
      const response = await axios.get(
        `${API_URL}/categories`,
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setCategories(response.data);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        toast.error(error.response.data.message || "Failed to fetch categories");
      } else {
        toast.error("Failed to fetch categories");
      }
      console.error("Error fetching categories:", error);
    } finally {
      setIsLoading(false);
    }
  }, [access_token]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await axios.post(
        `${API_URL}/categories/sync`,
        {},
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
            "Content-Type": "application/json",
          },
        }
      );
      await fetchCategories();
      toast.success("Categories list refreshed successfully");
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        toast.error(
          error.response.data.message || "Failed to refresh categories"
        );
      } else {
        toast.error("Failed to refresh categories");
      }
      console.error("Error refreshing categories:", error);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    if (!access_token) {
      console.error("No auth token found");
      return;
    }
    fetchCategories();
  }, [access_token, fetchCategories]);


  const [newName, setNewName] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    const name = newName.trim();
    if (!name) return;
    setIsAdding(true);
    try {
      await axios.post(
        `${API_URL}/categories`,
        { name },
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setNewName("");
      await fetchCategories();
      toast.success(`Category "${name}" added`);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        toast.error(error.response.data.message || "Failed to add category");
      } else {
        toast.error("Failed to add category");
      }
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold">Categories</h2>
          <p className="text-muted-foreground">
            View all categories and their message counts
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
          {isRefreshing ? "Refreshing..." : "Refresh Categories"}
        </Button>
      </div>

      <form
        onSubmit={handleAdd}
        className="mb-6 flex flex-wrap items-center gap-3 rounded-md border p-4"
      >
        <label htmlFor="new-category" className="text-sm font-medium">
          Add a category
        </label>
        <input
          id="new-category"
          type="text"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="e.g. Faith"
          maxLength={80}
          className="flex-1 min-w-[220px] rounded-md border px-3 py-2 text-sm"
        />
        <Button type="submit" disabled={isAdding || !newName.trim()}>
          {isAdding ? "Adding..." : "Add category"}
        </Button>
      </form>

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
                  Loading categories...
                </td>
              </tr>
            ) : categories.length === 0 ? (
              <tr>
                <td colSpan={3} className="p-2 text-center">
                  No categories found
                </td>
              </tr>
            ) : (
              categories.map((category) => (
                <tr
                  key={category._id}
                  className="border-b text-sm transition-colors hover:bg-muted/50"
                >
                  <td className="p-2">{category.name}</td>
                  <td className="p-2">{category.messageCount}</td>
                  <td className="p-2">
                    {format(new Date(category.updatedAt), "MMM d, yyyy HH:mm")}
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