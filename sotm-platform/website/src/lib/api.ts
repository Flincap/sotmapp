/* =========================================================================
   SERMON LIBRARY API CLIENT
   Talks to the glt-sermon-lib NestJS backend. The base URL is configurable
   via VITE_API_URL (see .env.example) and falls back to the deployed
   App Runner instance so the site works out of the box.
   ========================================================================= */

export const API_URL: string =
  (import.meta.env.VITE_API_URL as string | undefined)?.replace(/\/+$/, '') ||
  'https://sotm-api.vercel.app' // set VITE_API_URL in Vercel to your real API URL

/* ---------- Types (mirror the backend Message schema) ---------- */

export interface ApiMessage {
  _id: string
  title: string
  speaker: string
  size?: string
  downloadUrl: string
  imageUrl?: string
  date: string
  category: string[]
  isSeries: boolean
  seriesTitle?: string
  specialMeeting: boolean
  specialMeetingName?: string
  description?: string
  duration?: number
  featured?: boolean
  createdAt?: string
  updatedAt?: string
}

export interface MessagesPage {
  data: ApiMessage[]
  totalMessages: number
  currentPage: number
  limit: number
  totalPages: number
}

export interface MessageFilters {
  year?: string
  speaker?: string
  category?: string
  specialMeetingName?: string
  search?: string
}

/* ---------- Fetch helpers ---------- */

async function getJson<T>(path: string, signal?: AbortSignal): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    signal,
    headers: { Accept: 'application/json' },
  })
  if (!res.ok) {
    throw new Error(`Request failed (${res.status})`)
  }
  return res.json() as Promise<T>
}

export async function fetchMessages(
  page: number,
  filters: MessageFilters = {},
  sort: { field: string; order: 'asc' | 'desc' } = { field: 'date', order: 'desc' },
  signal?: AbortSignal,
): Promise<MessagesPage> {
  const params = new URLSearchParams({
    page: String(page),
    sortField: sort.field,
    sortOrder: sort.order,
  })
  Object.entries(filters).forEach(([key, value]) => {
    if (value) params.set(key, value)
  })
  return getJson<MessagesPage>(`/messages?${params.toString()}`, signal)
}

export async function fetchFeatured(signal?: AbortSignal): Promise<ApiMessage[]> {
  return getJson<ApiMessage[]>('/messages/featured', signal)
}

/** Public single-message lookup. Requires the backend fix that removes the
    JWT guard from GET /messages/:id (included in this repo's api/ folder).
    Callers should catch and fall back gracefully while an older backend
    build is still deployed. */
export async function fetchMessage(id: string, signal?: AbortSignal): Promise<ApiMessage> {
  return getJson<ApiMessage>(`/messages/${encodeURIComponent(id)}`, signal)
}

export interface CategoryOption {
  _id: string
  name: string
  messageCount?: number
}

/** GET /categories is public on the backend. */
export async function fetchCategories(signal?: AbortSignal): Promise<CategoryOption[]> {
  return getJson<CategoryOption[]>('/categories', signal)
}

export interface SpeakerOption {
  _id: string
  name: string
  messageCount?: number
}

/** GET /speakers becomes public with the backend fix in api/. Falls back to a
    curated list against older deployments. */
export async function fetchSpeakers(signal?: AbortSignal): Promise<SpeakerOption[]> {
  return getJson<SpeakerOption[]>('/speakers', signal)
}

export const FALLBACK_SPEAKERS = [
  'Apostle Segun Obadje',
  'Pastor Funke Obadje',
  'Pastor Poju Oyemade',
  'Bishop Francis Wale Oke',
  'Pastor Ose Imiemohon',
]

/* ---------- Download URL handling ----------
   Messages are hosted on OneDrive (and legacy files on Cloudinary). Each
   host needs a different nudge to force a direct browser download instead
   of opening a preview page. */

function base64UrlEncode(value: string): string {
  // UTF-8 safe: btoa alone throws on characters outside Latin-1.
  const bytes = new TextEncoder().encode(value)
  let binary = ''
  bytes.forEach((b) => {
    binary += String.fromCharCode(b)
  })
  return btoa(binary).replace(/=+$/, '').replace(/\//g, '_').replace(/\+/g, '-')
}

/**
 * Turns a share/preview link into a direct-download link.
 *
 * Supported hosts:
 * - OneDrive short links (1drv.ms)  -> Microsoft's documented shares API,
 *   which streams the file content directly.
 * - OneDrive full links (onedrive.live.com) -> download=1 query flag.
 * - SharePoint / OneDrive for Business (*.sharepoint.com) -> download=1.
 * - Cloudinary -> fl_attachment transformation.
 * - Anything else is returned untouched.
 */
export function toDirectDownloadUrl(rawUrl: string): string {
  if (!rawUrl) return rawUrl
  let url: URL
  try {
    url = new URL(rawUrl)
  } catch {
    return rawUrl
  }

  const host = url.hostname.toLowerCase()

  // OneDrive short share link
  if (host === '1drv.ms') {
    const encoded = base64UrlEncode(rawUrl)
    return `https://api.onedrive.com/v1.0/shares/u!${encoded}/root/content`
  }

  // OneDrive personal full link
  if (host.endsWith('onedrive.live.com')) {
    if (url.pathname.includes('/embed')) {
      url.pathname = url.pathname.replace('/embed', '/download')
      return url.toString()
    }
    url.searchParams.set('download', '1')
    return url.toString()
  }

  // SharePoint / OneDrive for Business
  if (host.endsWith('.sharepoint.com')) {
    url.searchParams.set('download', '1')
    return url.toString()
  }

  // Cloudinary
  if (host.endsWith('cloudinary.com') && url.pathname.includes('/upload/')) {
    url.pathname = url.pathname.replace('/upload/', '/upload/fl_attachment/')
    return url.toString()
  }

  return rawUrl
}

/** Makes a flier/thumbnail URL renderable inside <img>. OneDrive and
    SharePoint share links point at preview pages, not image bytes, so we
    route them through the direct-content conversion. Other hosts pass
    through untouched. */
export function toDisplayImageUrl(rawUrl?: string): string | undefined {
  if (!rawUrl) return rawUrl
  try {
    const host = new URL(rawUrl).hostname.toLowerCase()
    if (
      host === '1drv.ms' ||
      host.endsWith('onedrive.live.com') ||
      host.endsWith('.sharepoint.com')
    ) {
      return toDirectDownloadUrl(rawUrl)
    }
  } catch {
    /* not a URL — return as-is */
  }
  return rawUrl
}

/** Triggers a browser download for a message without navigating away. */
export function downloadMessage(message: Pick<ApiMessage, 'downloadUrl' | 'title'>): void {
  const href = toDirectDownloadUrl(message.downloadUrl)
  const a = document.createElement('a')
  a.href = href
  a.download = message.title || 'sotm-message'
  a.rel = 'noopener'
  document.body.appendChild(a)
  a.click()
  a.remove()
}

/* ---------- Formatters ---------- */

export function formatDate(iso: string): string {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ''
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

export function formatDuration(minutes?: number): string {
  if (!minutes || minutes <= 0) return ''
  const h = Math.floor(minutes / 60)
  const m = Math.round(minutes % 60)
  if (h === 0) return `${m} min`
  return m === 0 ? `${h} hr` : `${h} hr ${m} min`
}

/** Year options for the filter: first ministry upload year through now. */
export function yearOptions(from = 2018): string[] {
  const current = new Date().getFullYear()
  const years: string[] = []
  for (let y = current; y >= from; y--) years.push(String(y))
  return years
}
