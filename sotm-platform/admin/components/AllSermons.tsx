"use client";

import { API_URL, isPersonalOneDrive, toDirectDownloadUrl } from "@/lib/api";
import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import clsx from "clsx";
import { Message } from "@/lib/types";
import axios from "axios";
import { Button } from "./ui/button";
import { Clock, Calendar, Download, RotateCcw } from "lucide-react";
import { Loader2 } from "lucide-react";
import { Skeleton } from "./ui/skeleton";
import { Input } from "./ui/input";
import { motion } from "motion/react";
import { format } from "date-fns";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useDebouncedCallback } from "use-debounce";
import { CheckCircle } from "lucide-react";

import { Geist } from "next/font/google";

const geistSans = Geist({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export default function AllSermons() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState<number | null>(null);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    year: "",
    speaker: "",
    category: "",
    specialMeetingName: "",
  });
  const [isDownloadingMessage, setIsDownloadingMessage] = useState(false);

  /**
   * The function `handleFilterChange` updates filters based on user input and triggers a debounced
   * fetch operation.
   * @param event - The `event` parameter is an object that contains a `target` property, which is also
   * an object with `name` and `value` properties.
   */
  function handleFilterChange(event: {
    target: { name: string; value: string };
  }) {
    const { name, value } = event.target;
    const updatedFilters = { ...filters, [name]: value };
    setFilters(updatedFilters);
    debouncedFetch(updatedFilters, searchTerm);
  }

  /**
   * The function `handleSearch` takes a React ChangeEvent as input, updates the search term state, and
   * triggers a debounced fetch operation with the provided filters and search value.
   * @param e - The parameter `e` is an event object representing the change event that occurred,
   * specifically a `React.ChangeEvent<HTMLInputElement>`. This event object contains information about
   * the event, such as the target element that triggered the event (in this case, an input element) and
   * the new value of that element after.
   */
  function handleSearch(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    setSearchTerm(value);
    debouncedFetch(filters, value);
  }

  function handleFilterReset() {
    const resetFilters = {
      year: "",
      speaker: "",
      category: "",
      specialMeetingName: "",
    };
    setFilters(resetFilters);
    fetchMessages(1, resetFilters);
    toast(
      <div className="flex items-center gap-2">
        <CheckCircle className="text-green-500" size={16} />
        <span>Filters reset successfully</span>
      </div>,
      { position: "top-right" }
    );
  }

  const fetchMessages = useCallback(
    async (
      pageNumber = 1,
      currentFilters = filters,
      currentSearch = searchTerm
    ) => {
      setIsLoadingMore(true);
      try {
        // ${API_URL}/
        const response = await axios.get(
          `${API_URL}/messages?sortField=title&sortOrder=asc`,
          {
            params: {
              page: pageNumber,
              ...currentFilters,
              search: currentSearch,
            },
          }
        );
        const { data, totalPages } = response.data;
        if (pageNumber === 1) {
          setMessages(data);
        } else {
          setMessages((prevMessages) => [...prevMessages, ...data]);
        }
        setTotalPages(totalPages);
        setPage(pageNumber);
      } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
          setError(error.message);
        } else if (error instanceof Error) {
          setError(error.message);
        } else {
          setError("An unknown error occurred");
        }
        console.error("Error fetching messages:", error);
      } finally {
        setIsLoadingMore(false);
        setLoading(false);
      }
    },
    [filters, searchTerm]
  );

  const debouncedFetch = useDebouncedCallback((filters, searchTerm) => {
    fetchMessages(1, filters, searchTerm);
  }, 500);

  useEffect(() => {
    fetchMessages(1);
  }, [fetchMessages]);

  function handleLoadMoreMessages() {
    if (totalPages !== null && page < totalPages) {
      fetchMessages(page + 1);
    } else {
      console.log("No more messages to load.");
    }
  }

  function handleDownload(message: Message) {
    setIsDownloadingMessage(true);
    try {
      if (isPersonalOneDrive(message.downloadUrl)) {
        window.open(message.downloadUrl, "_blank", "noopener");
        return;
      }
      const downloadUrl = toDirectDownloadUrl(message.downloadUrl);

      const a = document.createElement("a");
      a.href = downloadUrl;
      a.download = message.title || "sermon"; // fallback
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (error) {
      console.log(error);
    } finally {
      setIsDownloadingMessage(false);
    }
  }

  if (loading)
    return (
      <section className="py-14">
        <div className="max-w-7xl mx-auto">
          <div className="relative">
            <div className="gap-4 gap-y-10 md:gap-6 pb-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4">
              {Array(12)
                .fill(null)
                .map((_, idx) => (
                  <div
                    key={idx}
                    className="lg:min-w-0 bg-white rounded-lg overflow-hidden shadow-sm"
                  >
                    <div className="relative h-[200px] w-full">
                      <Skeleton className="w-full h-full" />
                    </div>
                    <div className="p-4">
                      <Skeleton className="h-6 w-3/4 mb-2" />
                      <Skeleton className="h-4 w-1/2 mb-4" />
                      <div className="flex items-center justify-between mt-2 text-sm text-gray-600">
                        <Skeleton className="h-4 w-1/4" />
                        <Skeleton className="h-4 w-1/4" />
                        <Skeleton className="h-4 w-1/4" />
                      </div>
                      <Skeleton className="mt-4 h-4 w-1/2" />
                      <Skeleton className="mt-3 h-8 w-1/2" />
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </section>
    );
  if (error) return <div>{error}</div>;

  return (
    <section className="py-14">
      <div className="lg:max-w-[80%] max-w-[90%] mx-auto">
        <div className="mb-6">
          <h2 className="text-2xl font-bold">All Sermons</h2>
          <p className="text-gray-600 text-sm">
            Explore trending Sermons. Top picks for You.
          </p>
        </div>

        <div className="flex flex-wrap gap-4 mb-14 items-center">
          <div className="w-full sm:flex-1 lg:w-1/2">
            <Input
              type="text"
              placeholder="Search messages by title..."
              className="border-gray-300 rounded px-4 py-2 text-sm w-full"
              value={searchTerm}
              onChange={(e) => handleSearch(e)}
            />
          </div>

          <div className="w-full sm:flex-1 lg:w-1/6">
            <Select
              onValueChange={(value) =>
                handleFilterChange({ target: { name: "year", value } })
              }
              defaultValue={filters.year}
              value={filters.year}
            >
              <SelectTrigger className="border border-gray-300 rounded px-4 py-2 text-sm w-full">
                <SelectValue placeholder="Year" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Year</SelectLabel>
                  {Array.from(
                    { length: new Date().getFullYear() - 2018 + 1 },
                    (_, i) => 2018 + i
                  ).map((year) => (
                    <SelectItem key={year} value={year.toString()}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div className="w-full sm:flex-1 lg:w-1/6">
            <Select
              onValueChange={(value) =>
                handleFilterChange({ target: { name: "speaker", value } })
              }
              defaultValue={filters.speaker}
              value={filters.speaker}
            >
              <SelectTrigger className="border border-gray-300 rounded px-4 py-2 text-sm w-full">
                <SelectValue placeholder="Speaker" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Speaker</SelectLabel>
                  <SelectItem value="Apostle Segun Obadje">
                    Apostle Segun Obadje
                  </SelectItem>
                  <SelectItem value="Apostle Funke Obadje">
                    Pastor Funke Obadje
                  </SelectItem>
                  <SelectItem value="Pastor Poju Oyemade">
                    Pastor Poju Oyemade
                  </SelectItem>
                  <SelectItem value="Bishop Francis Wale Oke">
                    Bishop Francis Wale Oke
                  </SelectItem>
                  <SelectItem value="Pastor Ose Imiemohon">
                    Pastor Ose Imiemohon
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div className="w-full sm:flex-1 lg:w-1/6">
            <Select
              onValueChange={(value) =>
                handleFilterChange({ target: { name: "category", value } })
              }
              defaultValue={filters.category}
              value={filters.category}
            >
              <SelectTrigger className="border border-gray-300 rounded px-4 py-2 text-sm w-full">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Category</SelectLabel>
                  <SelectItem value="Redemption Realities">
                    Redemption Realities
                  </SelectItem>
                  <SelectItem value="New Creation Realities">
                    New Creation Realities
                  </SelectItem>
                  <SelectItem value="Mentoring">Mentoring</SelectItem>
                  <SelectItem value="Leadership">Leadership</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div className="w-full sm:flex-1 lg:w-1/6">
            <Select
              onValueChange={(value) =>
                handleFilterChange({
                  target: { name: "specialMeetingName", value },
                })
              }
              defaultValue={filters.specialMeetingName}
              value={filters.specialMeetingName}
            >
              <SelectTrigger className="border border-gray-300 rounded px-4 py-2 text-sm w-full">
                <SelectValue placeholder="Special Meeting" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Special Meeting</SelectLabel>
                  <SelectItem value="GGC">GGC</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div className="w-full sm:w-auto">
            <Button
              variant="outline"
              className="rounded-sm group w-full sm:w-auto"
              onClick={handleFilterReset}
            >
              <div className="flex items-center justify-center w-full">
                <div className="relative flex items-center">
                  <RotateCcw size={14} className="text-gray-500" />
                  <span className="ml-0 text-xs max-w-0 text-gray-600 overflow-hidden whitespace-nowrap group-hover:ml-2 group-hover:max-w-[100px] transition-all duration-700 ease-in-out">
                    Reset Filters
                  </span>
                </div>
              </div>
            </Button>
          </div>
        </div>

        <div className="relative">
          <div className="gap-4 gap-y-10 md:gap-6 pb-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 lg:mb-12">
            {messages?.length === 0 && (
              <div className="col-span-4 text-center py-10">
                <p className="text-gray-500">
                  No messages found. Please reset filters and try again.
                </p>
              </div>
            )}

            {messages?.map((message) => (
              <motion.div
                key={message._id}
                transition={{ duration: 0.3 }}
                className="lg:min-w-0 bg-white rounded-lg overflow-hidden shadow-sm"
                whileHover={{ scale: 1.02 }}
              >
                <div className="relative h-[220px] w-full">
                  <Image
                    src={message.imageUrl || "/sermon-img.jpeg"}
                    alt={message.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className={`p-4 ${geistSans.className}`}>
                  <h3 className={`font-semibold text-base`}>{message.title}</h3>
                  <span className="text-sm text-gray-600">
                    {message.speaker}
                  </span>

                  <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Clock size={14} className="text-gray-500" />
                      <span>{message.duration} mins</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar size={14} className="text-gray-500" />
                      <span>{format(new Date(message.date), "MMM yyyy")}</span>
                    </div>
                  </div>

                  <div className="mt-4 flex gap-2">
                    {message.category.map((cat, index) => (
                      <span
                        key={index}
                        className={`text-xs px-2 py-1 bg-gray-100 text-gray-700`}
                      >
                        {cat}
                      </span>
                    ))}
                  </div>

                  <div className="mt-3 flex items-center">
                    <Button
                      className={`group relative overflow-hidden text-white text-xs px-5 py-1 rounded-none mt-2 font-medium flex items-center`}
                      size={"lg"}
                      onClick={() => handleDownload(message)}
                    >
                      {isDownloadingMessage ? (
                        <Loader2 className="animate-spin" />
                      ) : (
                        <div className="flex items-center justify-center w-full">
                          <div className="relative flex items-center">
                            <Download className="w-4 h-4" />
                            <span className="ml-0 max-w-0 overflow-hidden whitespace-nowrap group-hover:ml-2 group-hover:max-w-[100px] transition-all duration-700 ease-in-out">
                              Download
                            </span>
                          </div>
                        </div>
                      )}
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <Button
            className={clsx(
              "rounded-none mx-auto flex",
              (page === totalPages || messages?.length === 0) && "hidden"
            )}
            size={"lg"}
            onClick={handleLoadMoreMessages}
            disabled={isLoadingMore || page === totalPages}
          >
            {isLoadingMore ? (
              <Loader2 className="animate-spin" />
            ) : (
              <span>Load More</span>
            )}
          </Button>
        </div>
      </div>
    </section>
  );
}
