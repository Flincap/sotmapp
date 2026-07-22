"use client";

import { API_URL } from "@/lib/api";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import axios from "axios";
import Image from "next/image";
import { Message } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Series } from "@/lib/types";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X, RefreshCw } from "lucide-react";

type Speaker = {
  _id: string;
  name: string;
  messageCount: number;
};

type EditMessageFormValues = {
  title: string;
  speaker: string;
  newSpeaker?: string;
  date: string;
  category: string;
  size?: string;
  downloadUrl: string;
  isSeries: boolean;
  newSeriesTitle?: string;
  seriesTitle?: string;
  specialMeeting: boolean;
  specialMeetingName?: string;
  duration: number;
  image?: FileList;
};

export function EditMessageForm({ messageId }: { messageId: string }) {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { errors },
  } = useForm<EditMessageFormValues>();
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [speakers, setSpeakers] = useState<Speaker[]>([]);
  const [isLoadingSpeakers, setIsLoadingSpeakers] = useState(true);
  const [selectedSpeaker, setSelectedSpeaker] = useState("");
  const [showNewSpeakerInput, setShowNewSpeakerInput] = useState(false);

  const [series, setSeries] = useState<Series[]>([]);
  const [isLoadingSeries, setIsLoadingSeries] = useState(true);
  const [selectedSeries, setSelectedSeries] = useState("");
  const [showNewSeriesInput, setShowNewSeriesInput] = useState(false);

  const [currentImageUrl, setCurrentImageUrl] = useState<string | null>(null);

  const isSeries = watch("isSeries");
  const specialMeeting = watch("specialMeeting");

  const access_token = localStorage.getItem("access_token");

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

  // Add this function to refresh categories
  const refreshCategories = async () => {
    try {
      setIsLoadingCategories(true);

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

  useEffect(() => {
    async function fetchSpeakers() {
      try {
        setIsLoadingSpeakers(true);
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
  }, [access_token]);

  useEffect(() => {
    async function fetchSeries() {
      try {
        setIsLoadingSeries(true);
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
        console.error("Error fetching series:", error);
        toast.error("Failed to load series");
      } finally {
        setIsLoadingSeries(false);
      }
    }

    if (isSeries) {
      fetchSeries();
    }
  }, [isSeries, access_token]);

  useEffect(() => {
    async function fetchMessage() {
      try {
        const response = await axios.get(
          `${API_URL}/messages/${messageId}`,
          {
            headers: {
              Authorization: `Bearer ${access_token}`,
              "Content-Type": "application/json",
            },
          }
        );
        const message: Message = response.data;

        // Format the date for the input
        const formattedDate = new Date(message.date)
          .toISOString()
          .split("T")[0];

        // Set all form values
        setValue("title", message.title);
        setValue("speaker", message.speaker);
        setSelectedSpeaker(message.speaker);
        setValue("date", formattedDate);
        setValue(
          "category",
          Array.isArray(message.category)
            ? message.category.join(", ")
            : message.category
        );
        setValue("size", message.size || "");
        setValue("downloadUrl", message.downloadUrl);
        setValue("duration", message.duration || 0);

        if (message.imageUrl) {
          setCurrentImageUrl(message.imageUrl);
        }

        // Handle boolean values and their dependent fields
        setValue("isSeries", Boolean(message.isSeries));
        if (message.isSeries) {
          setValue("seriesTitle", message.seriesTitle || "");
        }
        if (message.seriesTitle) {
          setSelectedSeries(message.seriesTitle);
        }

        setValue("specialMeeting", Boolean(message.specialMeeting));
        if (message.specialMeeting) {
          setValue("specialMeetingName", message.specialMeetingName || "");
        }

        // Add this to handle categories
        if (message.category) {
          const categoryArray = Array.isArray(message.category)
            ? message.category
            : [message.category];
          setSelectedCategories(categoryArray);
          setValue("category", categoryArray.join(", "));
        }

        // Add this to handle special meeting
        if (message.specialMeeting && message.specialMeetingName) {
          setSelectedSpecialMeeting(message.specialMeetingName);
        }

        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching message:", error);
        setIsLoading(false);
      }
    }

    fetchMessage();
  }, [messageId, setValue, access_token]);

  useEffect(() => {
    async function fetchSpecialMeetings() {
      try {
        setIsLoadingSpecialMeetings(true);
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
  }, [specialMeeting, access_token]);

  useEffect(() => {
    async function fetchCategories() {
      try {
        setIsLoadingCategories(true);
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
  }, [access_token]);

  function handleSpeakerChange(value: string) {
    if (value === "new_speaker") {
      setShowNewSpeakerInput(true);
      setValue("speaker", "");
    } else {
      setShowNewSpeakerInput(false);
      setValue("speaker", value);
    }
    setSelectedSpeaker(value);
  }

  function handleSeriesChange(value: string) {
    if (value === "new_series") {
      setShowNewSeriesInput(true);
      setValue("seriesTitle", "");
    } else {
      setShowNewSeriesInput(false);
      setValue("seriesTitle", value);
    }
    setSelectedSeries(value);
  }

  function handleSpecialMeetingChange(value: string) {
    if (value === "new_special_meeting") {
      setShowNewSpecialMeetingInput(true);
      setValue("specialMeetingName", "");
    } else {
      setShowNewSpecialMeetingInput(false);
      setValue("specialMeetingName", value);
    }
    setSelectedSpecialMeeting(value);
  }

  function handleCategoryChange(value: string) {
    if (selectedCategories.length >= 3 || selectedCategories.includes(value)) {
      return;
    }

    const newSelectedCategories = [...selectedCategories, value];
    setSelectedCategories(newSelectedCategories);
    setValue("category", newSelectedCategories.join(", "));
  }

  function removeCategory(categoryToRemove: string) {
    const newSelectedCategories = selectedCategories.filter(
      (category) => category !== categoryToRemove
    );
    setSelectedCategories(newSelectedCategories);
    setValue("category", newSelectedCategories.join(", "));
  }

  const onSubmit = async (data: EditMessageFormValues) => {
    try {
      setIsSubmitting(true);
      const formData = new FormData();

      if (data.image && data.image.length > 0) {
        formData.append("image", data.image[0]);
      }

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
        formData.append("specialMeetingName", data.specialMeetingName);
      }

      if (data.size) {
        formData.append("size", data.size);
      }

      formData.append("duration", JSON.stringify(Number(data.duration)));

      const categories = data.category.split(",").map((cat) => cat.trim());
      formData.append("category", JSON.stringify(categories));

      const response = await axios.patch(
        `${API_URL}/messages/${messageId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200) {
        reset();
        toast.success("Message updated successfully");
        router.push("/admin/messages");
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        console.error("Full error response:", error);
        toast.error("An error occurred while updating the message");
      } else {
        console.error("Error updating message:", error);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6 w-full max-w-2xl py-6 px-2"
    >
      <div className="space-y-2">
        <h2 className="text-base font-bold tracking-tight">Edit Message</h2>
        <p className="text-muted-foreground text-sm">
          Edit an existing message in the library.
        </p>
      </div>
      <div className="grid gap-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              {...register("title", { required: "Title is required" })}
            />
            {errors.title && (
              <p className="text-xs text-destructive italic">
                {errors.title.message}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="speaker">Speaker</Label>
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
          <Label htmlFor="date">Date</Label>
          <Input
            type="date"
            id="date"
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
            <Label htmlFor="category">Categories</Label>
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
                    className="bg-primary/10 text-xs text-primary px-2 py-1 rounded-md flex items-center gap-1"
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
                <p className="text-sm text-destructive italic">
                  {errors.category.message}
                </p>
              )}
            </>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="size">Size (optional)</Label>
          <p className="text-xs text-muted-foreground italic">E.g., 25 MB</p>
          <Input id="size" {...register("size")} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="downloadUrl">Download URL</Label>
          <Input
            id="downloadUrl"
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

        {/* <div className="space-y-2">
          <Label htmlFor="image">Image</Label>
          <Input
            id="image"
            type="file"
            accept="image/*"
            {...register("image", { required: "Image is required" })}
          />
          {errors.image && (
            <p className="text-xs text-destructive italic">
              {errors.image.message}
            </p>
          )}
        </div> */}

        <div className="space-y-2">
          <Label htmlFor="image">Image</Label>
          {currentImageUrl && (
            <div className="mb-2">
              <p className="text-sm text-muted-foreground mb-2">
                Current image:
              </p>
              <div className="relative h-32 w-full max-w-[150px] rounded overflow-hidden">
                <Image src={currentImageUrl} alt="Current message image" fill />
              </div>
            </div>
          )}
          <p className="text-xs text-muted-foreground italic">
            {currentImageUrl
              ? "Upload a new image only if you want to replace the current one"
              : "Upload an image for this message"}
          </p>
          <Input
            id="image"
            type="file"
            accept="image/*"
            {...register("image", {
              required: currentImageUrl ? false : "Image is required",
            })}
          />
          {errors.image && (
            <p className="text-xs text-destructive italic">
              {errors.image.message}
            </p>
          )}
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="isSeries"
            checked={Boolean(isSeries)}
            onCheckedChange={(checked: boolean) => {
              setValue("isSeries", checked);
              if (!checked) {
                setValue("seriesTitle", "");
              }
            }}
          />
          <Label htmlFor="isSeries">Is this part of a series?</Label>
        </div>

        {isSeries && (
          <div className="space-y-2">
            <Label htmlFor="seriesTitle">Series Title</Label>
            {isLoadingSeries ? (
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
                      {series.map((series) => (
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
          <Checkbox
            id="specialMeeting"
            checked={Boolean(specialMeeting)}
            onCheckedChange={(checked: boolean) => {
              setValue("specialMeeting", checked);
              if (!checked) {
                setValue("specialMeetingName", "");
              }
            }}
          />
          <Label htmlFor="specialMeeting">Is this a special meeting?</Label>
        </div>

        {specialMeeting && (
          <div className="space-y-2">
            <Label htmlFor="specialMeetingName">Special Meeting Name</Label>
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
                  <p className="text-sm text-destructive italic">
                    {errors.specialMeetingName.message}
                  </p>
                )}
              </>
            )}
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="duration">Duration (in minutes)</Label>
          <Input
            id="duration"
            type="number"
            {...register("duration", {
              required: "Duration is required",
              valueAsNumber: true,
            })}
          />
          {errors.duration && (
            <p className="text-sm text-destructive italic">
              {errors.duration.message}
            </p>
          )}
        </div>

        <div className="flex space-x-4">
          <Button type="submit" disabled={isSubmitting} className="flex-1">
            {isSubmitting ? "Saving..." : "Save Changes"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/admin/messages")}
            className="flex-1"
          >
            Cancel
          </Button>
        </div>
      </div>
    </form>
  );
}
