import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getOneDriveApiUrl = (oneDriveUrl: string) => {
  try {
    // Parse URL to extract needed parameters
    const url = new URL(oneDriveUrl);
    console.log("Url", url);
    const params = new URLSearchParams(url.search);

    // Extract the key components
    const authkey = params.get("authkey");
    const cid = params.get("cid")?.toLowerCase(); // Drive ID, lowercase
    const id = params.get("id")?.replace("%21", "!"); // Item ID

    // If we can't get the necessary parameters, return null
    if (!authkey || !cid || !id) {
      console.error("Missing required parameters in OneDrive URL");
      return null;
    }

    // The item ID might contain the drive ID already - handle both formats
    const itemId = id.includes("!") ? id.split("!")[1] : id;
    const driveId = cid;

    // Format for the OneDrive API URL
    const apiUrl = `https://api.onedrive.com/v1.0/drives/${driveId}/items/${driveId}!${itemId}?select=id%2C%40content.downloadUrl&authkey=${authkey.replace(
      "!",
      ""
    )}`;

    console.log("API Url", apiUrl);

    return apiUrl;
  } catch (error) {
    console.error("Error parsing OneDrive URL:", error);
    return null;
  }
};

export function formatDuration(minutes: number) {
  if (isNaN(minutes)) return "0 mins";

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (hours > 0 && remainingMinutes > 0) {
    return `${hours} hr ${remainingMinutes} mins`;
  } else if (hours > 0) {
    return `${hours} hr`;
  } else {
    return `${remainingMinutes} mins`;
  }
}
