import { useEffect, useState } from 'react'
import { Link, useLocation, useParams } from 'react-router-dom'
import Seo from '../components/Seo'
import Eyebrow from '../components/Eyebrow'
import Reveal from '../components/Reveal'
import Placeholder from '../components/Placeholder'
import {
  downloadMessage,
  fetchMessage,
  fetchMessages,
  formatDate,
  formatDuration,
  toDisplayImageUrl,
  type ApiMessage,
} from '../lib/api'
import { SITE_URL } from '../data'

export default function MessageDetail() {
  const { id } = useParams()
  const location = useLocation()
  const passed = (location.state as { message?: ApiMessage } | null)?.message

  const [message, setMessage] = useState<ApiMessage | null>(passed && passed._id === id ? passed : null)
  const [loading, setLoading] = useState(!message)
  const [error, setError] = useState('')
  const [related, setRelated] = useState<ApiMessage[]>([])
  const [copied, setCopied] = useState(false)
  const [downloading, setDownloading] = useState(false)

  // Fetch (or refresh) the message for deep links and page reloads.
  useEffect(() => {
    if (!id) return
    const controller = new AbortController()
    fetchMessage(id, controller.signal)
      .then((m) => {
        setMessage(m)
        setError('')
      })
      .catch((err: Error) => {
        if (err.name === 'AbortError') return
        // If we already have the message from navigation state, keep showing it.
        setMessage((current) => {
          if (!current) setError('This message could not be loaded. It may have been moved or removed.')
          return current
        })
      })
      .finally(() => setLoading(false))
    return () => controller.abort()
  }, [id])

  // A few more messages to keep listening to.
  useEffect(() => {
    const controller = new AbortController()
    fetchMessages(1, {}, { field: 'date', order: 'desc' }, controller.signal)
      .then((res) => setRelated(res.data.filter((m) => m._id !== id).slice(0, 3)))
      .catch(() => undefined)
    return () => controller.abort()
  }, [id])

  if (loading && !message) {
    return (
      <section className="bg-parchment">
        <div className="container-site flex min-h-[50vh] items-center justify-center py-20">
          <p className="font-display text-sm font-semibold uppercase tracking-wider text-ink-mute">Loading message…</p>
        </div>
      </section>
    )
  }

  if (!message) {
    return (
      <section className="bg-parchment">
        <div className="container-site flex min-h-[50vh] flex-col items-start justify-center py-20">
          <Eyebrow>Message library</Eyebrow>
          <h1 className="mt-4 text-3xl font-extrabold sm:text-4xl">{error || 'Message not found.'}</h1>
          <Link to="/messages" className="btn-ink mt-8">
            Browse all messages
          </Link>
        </div>
      </section>
    )
  }

  const shareUrl = `${SITE_URL}/messages/${message._id}`
  const shareText = `${message.title} — ${message.speaker}`
  const meta = [formatDate(message.date), formatDuration(message.duration), message.size].filter(Boolean).join(' · ')
  const collection = message.isSeries && message.seriesTitle
    ? message.seriesTitle
    : message.specialMeeting && message.specialMeetingName
      ? message.specialMeetingName
      : message.category?.[0] || 'Message'

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      window.prompt('Copy this link:', shareUrl)
    }
  }

  const nativeShare = async () => {
    try {
      await navigator.share({ title: message.title, text: shareText, url: shareUrl })
    } catch {
      /* user closed the sheet — nothing to do */
    }
  }

  const onDownload = () => {
    setDownloading(true)
    try {
      downloadMessage(message)
    } finally {
      window.setTimeout(() => setDownloading(false), 1500)
    }
  }

  const shareBtn = 'btn border border-ink/20 bg-white px-4 py-2.5 text-xs text-ink hover:border-plum hover:text-plum'

  return (
    <>
      <Seo title={message.title} description={message.description || `${message.title} by ${message.speaker}`} />

      <article>
        <header className="bg-ink text-parchment">
          <div className="container-site py-14 sm:py-16">
            <Reveal>
              <Link
                to="/messages"
                className="font-display text-sm font-semibold uppercase tracking-wider text-parchment/60 transition-colors hover:text-gold-bright"
              >
                ← All messages
              </Link>
            </Reveal>
            <Reveal delay={1}>
              <Eyebrow dark>{collection}</Eyebrow>
              <h1 className="mt-4 max-w-3xl font-display text-3xl font-extrabold leading-[1.05] sm:text-5xl">
                {message.title}
              </h1>
              <p className="mt-4 font-display text-sm font-semibold uppercase tracking-wider text-parchment/60">
                {message.speaker}
                {meta ? ` · ${meta}` : ''}
              </p>
            </Reveal>
          </div>
        </header>

        <div className="bg-parchment">
          <div className="container-site grid gap-12 py-14 lg:grid-cols-[1.6fr_1fr]">
            <div>
              <Reveal>
                {message.imageUrl ? (
                  <img src={toDisplayImageUrl(message.imageUrl)} alt="" className="aspect-video w-full rounded-sm object-cover" />
                ) : (
                  <Placeholder label="Message artwork" className="aspect-video w-full rounded-sm" />
                )}
              </Reveal>

              <Reveal className="mt-8">
                <div className="card flex flex-col items-start gap-5 p-6 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="eyebrow">Listen anywhere</p>
                    <p className="mt-2 text-lg">
                      Download this message as audio and listen offline, on any device.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={onDownload}
                    disabled={downloading || !message.downloadUrl}
                    className="btn-gold shrink-0 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {downloading ? 'Starting download…' : 'Download message'}
                  </button>
                </div>
              </Reveal>

              {message.description && (
                <Reveal className="mt-10">
                  <Eyebrow>About this message</Eyebrow>
                  <p className="mt-4 text-lg text-ink/80">{message.description}</p>
                </Reveal>
              )}

              {message.category?.length > 0 && (
                <Reveal className="mt-10">
                  <Eyebrow>Categories</Eyebrow>
                  <ul className="mt-4 flex flex-wrap gap-2">
                    {message.category.map((c) => (
                      <li
                        key={c}
                        className="rounded-sm border border-ink/15 bg-white px-3 py-1.5 font-display text-xs font-semibold uppercase tracking-wider text-ink-mute"
                      >
                        {c}
                      </li>
                    ))}
                  </ul>
                </Reveal>
              )}
            </div>

            <aside>
              <Reveal delay={1} className="card p-6">
                <Eyebrow>Share this message</Eyebrow>
                <div className="mt-5 flex flex-wrap gap-3">
                  <button type="button" onClick={copyLink} className={shareBtn}>
                    {copied ? 'Link copied ✓' : 'Copy link'}
                  </button>
                  <a
                    href={`https://wa.me/?text=${encodeURIComponent(`${shareText} ${shareUrl}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={shareBtn}
                  >
                    WhatsApp
                  </a>
                  <a
                    href={`https://x.com/intent/post?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={shareBtn}
                  >
                    Post on X
                  </a>
                  {'share' in navigator && (
                    <button type="button" onClick={nativeShare} className={shareBtn}>
                      More…
                    </button>
                  )}
                </div>
              </Reveal>

              {related.length > 0 && (
                <Reveal delay={2} className="mt-6">
                  <div className="card p-6">
                    <Eyebrow>Keep listening</Eyebrow>
                    <ul className="mt-4 space-y-4">
                      {related.map((m) => (
                        <li key={m._id}>
                          <Link to={`/messages/${m._id}`} state={{ message: m }} className="group block">
                            <p className="font-bold leading-snug transition-colors group-hover:text-plum">{m.title}</p>
                            <p className="mt-1 text-sm text-ink-mute">
                              {m.speaker} · {formatDate(m.date)}
                            </p>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </Reveal>
              )}
            </aside>
          </div>
        </div>
      </article>
    </>
  )
}
