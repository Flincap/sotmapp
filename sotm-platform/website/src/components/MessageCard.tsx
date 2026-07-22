import { useState } from 'react'
import { Link } from 'react-router-dom'
import Placeholder from './Placeholder'
import { downloadMessage, formatDate, formatDuration, type ApiMessage } from '../lib/api'

interface MessageCardProps {
  message: ApiMessage
}

/** One sermon in the library grid. The link and the download button are
    siblings — never nested — so keyboard and screen-reader navigation
    stay valid. */
export default function MessageCard({ message }: MessageCardProps) {
  const [downloading, setDownloading] = useState(false)

  const onDownload = () => {
    setDownloading(true)
    try {
      downloadMessage(message)
    } finally {
      window.setTimeout(() => setDownloading(false), 1500)
    }
  }

  const meta = [formatDate(message.date), formatDuration(message.duration), message.size]
    .filter(Boolean)
    .join(' · ')

  return (
    <article className="card group flex h-full flex-col overflow-hidden">
      <Link
        to={`/messages/${message._id}`}
        state={{ message }}
        className="flex flex-col"
        aria-label={`${message.title} by ${message.speaker}`}
      >
        {message.imageUrl ? (
          <img
            src={message.imageUrl}
            alt=""
            loading="lazy"
            className="aspect-video w-full object-cover"
          />
        ) : (
          <Placeholder label="Thumbnail" className="aspect-video w-full" />
        )}
        <div className="p-6 pb-0">
          <p className="eyebrow">
            {message.isSeries && message.seriesTitle
              ? message.seriesTitle
              : message.specialMeeting && message.specialMeetingName
                ? message.specialMeetingName
                : message.category?.[0] || 'Message'}
          </p>
          <h3 className="mt-3 text-xl font-bold leading-snug transition-colors group-hover:text-plum">
            {message.title}
          </h3>
          <p className="mt-2 text-sm text-ink-mute">{message.speaker}</p>
          {meta && <p className="mt-2 text-xs uppercase tracking-wider text-ink-mute">{meta}</p>}
          {message.description && (
            <p className="mt-3 line-clamp-2 text-sm text-ink/75">{message.description}</p>
          )}
        </div>
      </Link>

      <div className="mt-auto flex flex-wrap items-center gap-3 p-6 pt-5">
        <button
          type="button"
          onClick={onDownload}
          disabled={downloading || !message.downloadUrl}
          className="btn border-2 border-ink px-4 py-2 text-xs text-ink hover:bg-ink hover:text-parchment disabled:cursor-not-allowed disabled:opacity-50"
        >
          {downloading ? 'Starting…' : 'Download'}
          {!downloading && (
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path
                d="M7 1v8m0 0L3.5 5.5M7 9l3.5-3.5M2 12.5h10"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </button>
        <Link
          to={`/messages/${message._id}`}
          state={{ message }}
          className="font-display text-xs font-semibold uppercase tracking-wider text-gold-deep hover:text-gold"
        >
          Details →
        </Link>
      </div>
    </article>
  )
}
