/**
 * Single source of truth for the sermon-library API base URL.
 * Set NEXT_PUBLIC_API_URL in .env.local; falls back to the deployed instance.
 */
export const API_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/+$/, "") ||
  "https://sotm-api.vercel.app";

/** Personal OneDrive links can no longer be converted to direct downloads
 * (Microsoft disabled the anonymous shares API in late 2024). */
export function isPersonalOneDrive(rawUrl: string): boolean {
  try {
    const host = new URL(rawUrl).hostname.toLowerCase();
    return host === "1drv.ms" || host.endsWith("onedrive.live.com");
  } catch {
    return false;
  }
}

/**
 * Converts a share/preview link into a direct-download link where the host
 * still supports it (SharePoint / OneDrive for Business, Cloudinary).
 * Personal OneDrive links are returned unchanged — open those in a new tab.
 */
export function toDirectDownloadUrl(rawUrl: string): string {
  if (!rawUrl) return rawUrl;
  let url: URL;
  try {
    url = new URL(rawUrl);
  } catch {
    return rawUrl;
  }
  const host = url.hostname.toLowerCase();

  if (host.endsWith(".sharepoint.com")) {
    url.searchParams.set("download", "1");
    return url.toString();
  }
  if (host.endsWith("cloudinary.com") && url.pathname.includes("/upload/")) {
    url.pathname = url.pathname.replace("/upload/", "/upload/fl_attachment/");
    return url.toString();
  }
  return rawUrl;
}
