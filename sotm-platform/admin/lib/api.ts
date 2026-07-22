/**
 * Single source of truth for the sermon-library API base URL.
 * Set NEXT_PUBLIC_API_URL in .env.local; falls back to the deployed instance.
 */
export const API_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/+$/, "") ||
  "https://uc7xib3dvz.us-east-1.awsapprunner.com";

/**
 * Converts a share/preview link into a direct-download link.
 * Handles OneDrive short links (1drv.ms), OneDrive personal links,
 * SharePoint / OneDrive for Business, and Cloudinary. Anything else
 * is returned untouched.
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

  if (host === "1drv.ms") {
    // UTF-8 safe base64url: btoa alone throws on non-Latin-1 characters.
    const bytes = new TextEncoder().encode(rawUrl);
    let binary = "";
    bytes.forEach((b) => {
      binary += String.fromCharCode(b);
    });
    const encoded = btoa(binary)
      .replace(/=+$/, "")
      .replace(/\//g, "_")
      .replace(/\+/g, "-");
    return `https://api.onedrive.com/v1.0/shares/u!${encoded}/root/content`;
  }
  if (host.endsWith("onedrive.live.com")) {
    if (url.pathname.includes("/embed")) {
      url.pathname = url.pathname.replace("/embed", "/download");
      return url.toString();
    }
    url.searchParams.set("download", "1");
    return url.toString();
  }
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
