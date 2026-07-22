"use client";

import { API_URL, isPersonalOneDrive, toDirectDownloadUrl } from "@/lib/api";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import axios from "axios";
import { Message } from "@/lib/types";
import { format } from "date-fns";
import { Clock, Calendar, Download } from "lucide-react";
import { Button } from "./ui/button";
import { Skeleton } from "./ui/skeleton";
import { motion } from "motion/react";
import { Loader2 } from "lucide-react";
import { Geist } from "next/font/google";

const geistSans = Geist({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export default function FeaturedSermons() {
  const [featuredSermons, setFeaturedSermons] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDownloadingMessage, setIsDownloadingMessage] = useState(false);

  useEffect(() => {
    async function fetchFeaturedSermons() {
      try {
        setIsLoading(true);
        const response = await axios.get(
          `${API_URL}/messages/featured`
        );
        setFeaturedSermons(response.data);
      } catch (error) {
        console.error("Error fetching featured sermons:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchFeaturedSermons();
  }, []);

  if (isLoading) {
    return (
      <section className="py-8">
        <div className="lg:max-w-[80%] max-w-[90%] mx-auto">
          <div className="mb-6">
            <h2 className="text-2xl font-bold">Featured Sermons</h2>
            <p className="text-gray-600 text-sm">
              Explore trending Sermons. Top picks for You.
            </p>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-6 lg:grid lg:grid-cols-4 lg:gap-4 lg:overflow-hidden">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="min-w-[280px] sm:min-w-[320px] lg:min-w-0 bg-white rounded-lg overflow-hidden shadow-sm flex-shrink-0"
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
      </section>
    );
  }

  if (featuredSermons.length === 0) {
    return null; // Don't show the section if there are no featured sermons
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

  return (
    <section className="py-8">
      <div className="lg:max-w-[80%] max-w-[90%] mx-auto">
        <div className="mb-6">
          <h2 className="text-2xl font-bold">Featured Sermons</h2>
          <p className="text-gray-600 text-sm">
            Explore trending Sermons. Top picks for You.
          </p>
        </div>
        <div className="relative">
          <div className="flex gap-4 overflow-x-auto pb-6 lg:grid lg:grid-cols-4 lg:gap-4 lg:overflow-hidden">
            {featuredSermons.map((sermon) => (
              <motion.div
                key={sermon._id}
                transition={{ duration: 0.3 }}
                className="min-w-[280px] sm:min-w-[320px] lg:min-w-0 bg-white rounded-lg overflow-hidden shadow-sm flex-shrink-0"
                whileHover={{ scale: 1.02 }}
              >
                <div className="relative h-[220px] w-full">
                  <Image
                    src={sermon.imageUrl || "/sermon-img.jpeg"}
                    alt={sermon.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className={`p-4 ${geistSans.className}`}>
                  <h3 className={`font-semibold text-base`}>{sermon.title}</h3>
                  <span className="text-sm text-gray-600">
                    {sermon.speaker}
                  </span>

                  <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Clock size={14} className="text-gray-500" />
                      <span>{sermon.duration} mins</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar size={14} className="text-gray-500" />
                      <span>{format(new Date(sermon.date), "MMM yyyy")}</span>
                    </div>
                  </div>

                  <div className="mt-4 flex gap-2">
                    {sermon.category.map((cat, index) => (
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
                      onClick={() => handleDownload(sermon)}
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
        </div>
      </div>
    </section>
  );
}
