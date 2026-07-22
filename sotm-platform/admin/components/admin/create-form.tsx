"use client";

import { API_URL } from "@/lib/api";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { X, RefreshCw } from "lucide-react"; // For the remove button on selected categories and refresh button

type Speaker = {
  _id: string;
  name: string;
  messageCount: number;
};

type Series = {
  _id: string;
  title: string;
  messageCount: number;
};

type CreateMessageFormValues = {
  title: string;
  speaker: string;
  newSpeaker?: string;
  date: string;
  category: string;
  size?: string;
  downloadUrl: string;
  isSeries: boolean;
  seriesTitle?: string;
  newSeriesTitle?: string;
  specialMeeting: boolean;
  specialMeetingName?: string;
  duration: number;
  image: FileList;
};

export function CreateMessageForm() {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { errors },
  } = useForm<CreateMessageFormValues>();
  const router = useRouter();

  const isSeries = watch("isSeries");
  const specialMeeting = watch("specialMeeting");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [speakers, setSpeakers] = useState<Speaker[]>([]);
  const [isLoadingSpeakers, setIsLoadingSpeakers] = useState(true);
  const [selectedSpeaker, setSelectedSpeaker] = useState<string>("");
  const [showNewSpeakerInput, setShowNewSpeakerInput] = useState(false);

  const [seriesList, setSeriesList] = useState<Series[]>([]);
  const [isLoadingSeriesList, setIsLoadingSeriesList] = useState(true);
  const [selectedSeries, setSelectedSeries] = useState<string>("");
  const [showNewSeriesInput, setShowNewSeriesInput] = useState(false);

  const [specialMeetings, setSpecialMeetings] = useState<
    { _id: string; name: string }[]
  >([]);
  const [isLoadingSpecialMeetings, setIsLoadingSpecialMeetings] =
    useState(true);
  const [selectedSpecialMeeting, setSelectedSpecialMeeting] =
    useState<string>("");
  const [showNewSpecialMeetingInput, setShowNewSpecialMeetingInput] =
    useState(false);

  const [categories, setCategories] = useState<{ _id: string; name: string }[]>(
    []
  );
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  useEffect(() => {
    async function fetchSpeakers() {
      try {
        setIsLoadingSpeakers(true);
        const access_token = localStorage.getItem("access_token");

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
        console.error("Error fetching speakers:", error);
        toast.error("Failed to load speakers");
      } finally {
        setIsLoadingSpeakers(false);
      }
    }

    fetchSpeakers();
  }, []);

  useEffect(() => {
    async function fetchSeries() {
      try {
        setIsLoadingSeriesList(true);
        const access_token = localStorage.getItem("access_token");

        const response = await axios.get(
          `${API_URL}/series`,
          {
            headers: {
              Authorization: `Bearer ${access_token}`,
              "Content-Type": "application/json",
            },
          }
        );
        setSeriesList(response.data);
      } catch (error) {
        console.error("Error fetching series:", error);
        toast.error("Failed to load series");
      } finally {
        setIsLoadingSeriesList(false);
      }
    }

    if (isSeries) {
      fetchSeries();
    }
  }, [isSeries]);

  useEffect(() => {
    async function fetchSpecialMeetings() {
      try {
        setIsLoadingSpecialMeetings(true);
        const access_token = localStorage.getItem("access_token");

        const response = await axios.get(
          `${API_URL}/special-meetings`,
          {
            headers: {
              Authorization: `Bearer ${access_token}`,
              "Content-Type": "application/json",
            },
          }
        );
        setSpecialMeetings(response.data);
      } catch (error) {
        console.error("Error fetching special meetings:", error);
        toast.error("Failed to load special meetings");
      } finally {
        setIsLoadingSpecialMeetings(false);
      }
    }

    if (specialMeeting) {
      fetchSpecialMeetings();
    }
  }, [specialMeeting]);

  useEffect(() => {
    async function fetchCategories() {
      try {
        setIsLoadingCategories(true);
        const access_token = localStorage.getItem("access_token");

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
        console.error("Error fetching categories:", error);
        toast.error("Failed to load categories");
      } finally {
        setIsLoadingCategories(false);
      }
    }

    fetchCategories();
  }, []);

  const handleSpeakerChange = (value: string) => {
    if (value === "new_speaker") {
      setShowNewSpeakerInput(true);
      setValue("speaker", "");
    } else {
      setShowNewSpeakerInput(false);
      setValue("speaker", value);
    }
    setSelectedSpeaker(value);
  };

  const handleSeriesChange = (value: string) => {
    if (value === "new_series") {
      setShowNewSeriesInput(true);
      setValue("seriesTitle", "");
    } else {
      setShowNewSeriesInput(false);
      setValue("seriesTitle", value);
    }
    setSelectedSeries(value);
  };

  const handleSpecialMeetingChange = (value: string) => {
    if (value === "new_special_meeting") {
      setShowNewSpecialMeetingInput(true);
      setValue("specialMeetingName", "");
    } else {
      setShowNewSpecialMeetingInput(false);
      setValue("specialMeetingName", value);
    }
    setSelectedSpecialMeeting(value);
  };

  const handleCategoryChange = (value: string) => {
    // Don't add if already 3 categories or if already selected
    if (selectedCategories.length >= 3 || selectedCategories.includes(value)) {
      return;
    }

    const newSelectedCategories = [...selectedCategories, value];
    setSelectedCategories(newSelectedCategories);
    setValue("category", newSelectedCategories.join(", "));
  };

  const removeCategory = (categoryToRemove: string) => {
    const newSelectedCategories = selectedCategories.filter(
      (category) => category !== categoryToRemove
    );
    setSelectedCategories(newSelectedCategories);
    setValue("category", newSelectedCategories.join(", "));
  };

  const onSubmit = async (data: CreateMessageFormValues) => {
    try {
      setIsSubmitting(true);

      const access_token = localStorage.getItem("access_token");

      const formData = new FormData();

      if (data.image && data.image.length > 0) {
        formData.append("image", data.image[0]);
      }

      // Use the new speaker name if that option was selected
      const speakerName =
        showNewSpeakerInput && data.newSpeaker ? data.newSpeaker : data.speaker;

      formData.append("title", data.title);
      formData.append("speaker", speakerName);
      formData.append("date", new Date(data.date).toISOString());
      formData.append("downloadUrl", data.downloadUrl);
      formData.append("isSeries", JSON.stringify(Boolean(data.isSeries)));
      formData.append(
        "specialMeeting",
        JSON.stringify(Boolean(data.specialMeeting))
      );

      if (data.isSeries && data.seriesTitle) {
        const seriesTitle =
          showNewSeriesInput && data.newSeriesTitle
            ? data.newSeriesTitle
            : data.seriesTitle;
        formData.append("seriesTitle", seriesTitle);
      }

      if (data.specialMeeting && data.specialMeetingName) {
        const specialMeetingName =
          showNewSpecialMeetingInput && data.specialMeetingName
            ? data.specialMeetingName
            : data.specialMeetingName;
        formData.append("specialMeetingName", specialMeetingName);
      }

      if (data.size) {
        formData.append("size", data.size);
      }

      formData.append("duration", JSON.stringify(Number(data.duration)));

      const categories = data.category
        .split(",")
        .map((cat) => cat.trim())
        .filter((cat) => cat.length > 0);
      formData.append("category", JSON.stringify(categories));

      const response = await axios.post(
        `${API_URL}/messages`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 201 || response.status === 200) {
        reset();
        toast.success("Message created successfully");
        router.push("/admin/messages");
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        console.error("Full error response:", error);
        toast.error("An error occurred while creating the message");
      } else {
        console.error("Error creating message:", error);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Add this function to refresh categories
  const refreshCategories = async () => {
    try {
      setIsLoadingCategories(true);
      const access_token = localStorage.getItem("access_token");

      // Call the sync endpoint
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

      // Fetch the updated categories
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
      toast.success("Categories refreshed successfully");
    } catch (error) {
      console.error("Error refreshing categories:", error);
      toast.error("Failed to refresh categories");
    } finally {
      setIsLoadingCategories(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4 w-full max-w-2xl p-6"
    >
      <div className="space-y-2">
        <h2 className="text-base font-bold tracking-tight">
          Upload New Message
        </h2>
        <p className="text-muted-foreground text-sm">
          Upload a new message to the library
        </p>
      </div>

      <div className="grid gap-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Title
            </label>
            <Input {...register("title", { required: "Title is required" })} />
            {errors.title && (
              <p className="text-xs text-destructive italic">
                {errors.title.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Speaker
            </label>
            {isLoadingSpeakers ? (
              <div className="h-10 w-full bg-muted animate-pulse rounded"></div>
            ) : (
              <>
                <Select
                  onValueChange={handleSpeakerChange}
                  value={selectedSpeaker}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a speaker" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Speakers</SelectLabel>
                      {speakers.map((speaker) => (
                        <SelectItem key={speaker._id} value={speaker.name}>
                          {speaker.name}
                        </SelectItem>
                      ))}
                      <SelectItem value="new_speaker">
                        + Add New Speaker
                      </SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>

                {showNewSpeakerInput && (
                  <div className="mt-2">
                    <Input
                      placeholder="Enter new speaker name"
                      {...register("newSpeaker", {
                        required: showNewSpeakerInput
                          ? "New speaker name is required"
                          : false,
                      })}
                    />
                    {errors.newSpeaker && (
                      <p className="text-xs text-destructive italic">
                        {errors.newSpeaker.message}
                      </p>
                    )}
                  </div>
                )}

                {!showNewSpeakerInput && (
                  <input
                    type="hidden"
                    {...register("speaker", {
                      required: "Speaker is required",
                    })}
                  />
                )}

                {errors.speaker && !showNewSpeakerInput && (
                  <p className="text-xs text-destructive italic">
                    {errors.speaker.message}
                  </p>
                )}
              </>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            Date
          </label>
          <Input
            type="date"
            {...register("date", { required: "Date is required" })}
          />
          {errors.date && (
            <p className="text-xs text-destructive italic">
              {errors.date.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Categories
            </label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={refreshCategories}
              disabled={isLoadingCategories}
              className="text-xs flex items-center gap-1"
            >
              <RefreshCw
                size={12}
                className={isLoadingCategories ? "animate-spin" : ""}
              />
              {isLoadingCategories ? "Refreshing..." : "Sync Categories"}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground italic">
            Select up to 3 categories. Use &quot;Sync Categories&quot; to update
            the list if you&apos;ve recently added new categories.
          </p>

          {isLoadingCategories ? (
            <div className="h-10 w-full bg-muted animate-pulse rounded"></div>
          ) : (
            <>
              <div className="flex flex-wrap gap-2 mb-2">
                {selectedCategories.map((category) => (
                  <div
                    key={category}
                    className="bg-primary/10 text-primary text-sm px-2 py-1 rounded-md flex items-center gap-1"
                  >
                    <span>{category}</span>
                    <button
                      type="button"
                      onClick={() => removeCategory(category)}
                      className="text-primary hover:text-primary/80"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>

              <Select
                onValueChange={handleCategoryChange}
                disabled={selectedCategories.length >= 3}
              >
                <SelectTrigger className="w-full">
                  <SelectValue
                    placeholder={
                      selectedCategories.length >= 3
                        ? "Max categories selected"
                        : "Select a category"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Categories</SelectLabel>
                    {categories.map((category) => (
                      <SelectItem
                        key={category._id}
                        value={category.name}
                        disabled={selectedCategories.includes(category.name)}
                      >
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>

              <input
                type="hidden"
                {...register("category", {
                  required: "At least one category is required",
                  validate: (value) => {
                    const cats = value
                      .split(",")
                      .map((cat) => cat.trim())
                      .filter((cat) => cat.length > 0);
                    if (cats.length === 0)
                      return "At least one category is required";
                    if (cats.length > 3) return "Maximum 3 categories allowed";
                    return true;
                  },
                })}
              />

              {errors.category && (
                <p className="text-xs text-destructive italic">
                  {errors.category.message}
                </p>
              )}
            </>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            Size (optional)
          </label>
          <p className="text-xs text-muted-foreground italic">E.g., 25 MB</p>

          <Input {...register("size")} />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            Download URL
          </label>
          <Input
            {...register("downloadUrl", {
              required: "Download URL is required",
            })}
          />
          {errors.downloadUrl && (
            <p className="text-xs text-destructive italic">
              {errors.downloadUrl.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            Image
          </label>
          <Input
            type="file"
            accept="image/*"
            {...register("image", { required: "Image is required" })}
          />
          {errors.image && (
            <p className="text-xs text-destructive italic">
              {errors.image.message}
            </p>
          )}
        </div>

        <div className="flex items-center space-x-2">
          <Input
            type="checkbox"
            {...register("isSeries")}
            id="isSeries"
            className="h-4 w-4"
          />
          <label
            htmlFor="isSeries"
            className="text-sm font-medium leading-none"
          >
            Is this part of a series?
          </label>
        </div>

        {isSeries && (
          <div className="space-y-2">
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Series Title
            </label>
            {isLoadingSeriesList ? (
              <div className="h-10 w-full bg-muted animate-pulse rounded"></div>
            ) : (
              <>
                <Select
                  onValueChange={handleSeriesChange}
                  value={selectedSeries}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a series" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Series</SelectLabel>
                      {seriesList.map((series) => (
                        <SelectItem key={series._id} value={series.title}>
                          {series.title}
                        </SelectItem>
                      ))}
                      <SelectItem value="new_series">
                        + Add New Series
                      </SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>

                {showNewSeriesInput && (
                  <div className="mt-2">
                    <Input
                      placeholder="Enter new series title"
                      {...register("newSeriesTitle", {
                        required: showNewSeriesInput
                          ? "New series title is required"
                          : false,
                      })}
                    />
                    {errors.newSeriesTitle && (
                      <p className="text-xs text-destructive italic">
                        {errors.newSeriesTitle.message}
                      </p>
                    )}
                  </div>
                )}

                {!showNewSeriesInput && (
                  <input
                    type="hidden"
                    {...register("seriesTitle", {
                      required: "Series title is required",
                    })}
                  />
                )}

                {errors.seriesTitle && !showNewSeriesInput && (
                  <p className="text-xs text-destructive italic">
                    {errors.seriesTitle.message}
                  </p>
                )}
              </>
            )}
          </div>
        )}

        <div className="flex items-center space-x-2">
          <Input
            type="checkbox"
            {...register("specialMeeting")}
            id="specialMeeting"
            className="h-4 w-4"
          />
          <label
            htmlFor="specialMeeting"
            className="text-sm font-medium leading-none"
          >
            Is this a special meeting?
          </label>
        </div>

        {specialMeeting && (
          <div className="space-y-2">
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Special Meeting Name
            </label>
            {isLoadingSpecialMeetings ? (
              <div className="h-10 w-full bg-muted animate-pulse rounded"></div>
            ) : (
              <>
                <Select
                  onValueChange={handleSpecialMeetingChange}
                  value={selectedSpecialMeeting}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a special meeting" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Special Meetings</SelectLabel>
                      {specialMeetings.map((meeting) => (
                        <SelectItem key={meeting._id} value={meeting.name}>
                          {meeting.name}
                        </SelectItem>
                      ))}
                      <SelectItem value="new_special_meeting">
                        + Add New Special Meeting
                      </SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>

                {showNewSpecialMeetingInput && (
                  <div className="mt-2">
                    <Input
                      placeholder="Enter new special meeting name"
                      {...register("specialMeetingName", {
                        required: showNewSpecialMeetingInput
                          ? "New special meeting name is required"
                          : false,
                      })}
                    />
                    {errors.specialMeetingName && (
                      <p className="text-xs text-destructive italic">
                        {errors.specialMeetingName.message}
                      </p>
                    )}
                  </div>
                )}

                {!showNewSpecialMeetingInput && (
                  <input
                    type="hidden"
                    {...register("specialMeetingName", {
                      required: "Special meeting name is required",
                    })}
                  />
                )}

                {errors.specialMeetingName && !showNewSpecialMeetingInput && (
                  <p className="text-xs text-destructive italic">
                    {errors.specialMeetingName.message}
                  </p>
                )}
              </>
            )}
          </div>
        )}

        <div className="space-y-2">
          <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            Duration (in minutes)
          </label>
          <p className="text-xs text-muted-foreground italic">
            E.g., 45, 60, 90
          </p>
          <Input
            type="number"
            {...register("duration", {
              required: "Duration is required",
              valueAsNumber: true,
            })}
          />
          {errors.duration && (
            <p className="text-xs text-destructive italic">
              {errors.duration.message}
            </p>
          )}
        </div>
      </div>

      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? "Uploading..." : "Upload Message"}
      </Button>
    </form>
  );
}
