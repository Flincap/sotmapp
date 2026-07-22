import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Seo from '../components/Seo'
import PageHeader from '../components/PageHeader'
import MessageCard from '../components/MessageCard'
import {
  FALLBACK_SPEAKERS,
  fetchCategories,
  fetchMessages,
  fetchSpeakers,
  yearOptions,
  type ApiMessage,
  type MessageFilters,
} from '../lib/api'

const ALL = ''

/** Skeleton card shown while the library loads. */
function CardSkeleton() {
  return (
    <li className="card animate-pulse overflow-hidden" aria-hidden="true">
      <div className="aspect-video w-full bg-ink/10" />
      <div className="space-y-3 p-6">
        <div className="h-3 w-24 rounded-sm bg-ink/10" />
        <div className="h-5 w-3/4 rounded-sm bg-ink/10" />
        <div className="h-4 w-1/2 rounded-sm bg-ink/10" />
        <div className="h-9 w-32 rounded-sm bg-ink/10" />
      </div>
    </li>
  )
}

export default function Messages() {
  const [messages, setMessages] = useState<ApiMessage[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [error, setError] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState<number | null>(null)
  const [totalMessages, setTotalMessages] = useState<number | null>(null)

  const [search, setSearch] = useState('')
  const [year, setYear] = useState(ALL)
  const [speaker, setSpeaker] = useState(ALL)
  const [category, setCategory] = useState(ALL)

  const [speakers, setSpeakers] = useState<string[]>(FALLBACK_SPEAKERS)
  const [categories, setCategories] = useState<string[]>([])

  const abortRef = useRef<AbortController | null>(null)
  const debounceRef = useRef<number>()

  const filters: MessageFilters = useMemo(
    () => ({
      search: search.trim() || undefined,
      year: year || undefined,
      speaker: speaker || undefined,
      category: category || undefined,
    }),
    [search, year, speaker, category],
  )

  const load = useCallback(
    async (pageNumber: number, activeFilters: MessageFilters, append: boolean) => {
      abortRef.current?.abort()
      const controller = new AbortController()
      abortRef.current = controller

      if (append) setLoadingMore(true)
      else setLoading(true)
      setError('')

      try {
        const result = await fetchMessages(pageNumber, activeFilters, { field: 'date', order: 'desc' }, controller.signal)
        setMessages((prev) => (append ? [...prev, ...result.data] : result.data))
        setTotalPages(result.totalPages)
        setTotalMessages(result.totalMessages)
        setPage(result.currentPage)
      } catch (err) {
        if ((err as Error).name === 'AbortError') return
        setError('The message library could not be reached. Please check your connection and try again.')
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false)
          setLoadingMore(false)
        }
      }
    },
    [],
  )

  // Initial load + reload when filters change (search is debounced).
  useEffect(() => {
    window.clearTimeout(debounceRef.current)
    debounceRef.current = window.setTimeout(
      () => {
        void load(1, filters, false)
      },
      filters.search ? 450 : 0,
    )
    return () => window.clearTimeout(debounceRef.current)
  }, [filters, load])

  // Filter options — public endpoints, silent fallback if unavailable.
  useEffect(() => {
    const controller = new AbortController()
    fetchCategories(controller.signal)
      .then((list) => setCategories(list.map((c) => c.name).filter(Boolean)))
      .catch(() => undefined)
    fetchSpeakers(controller.signal)
      .then((list) => {
        const names = list.map((s) => s.name).filter(Boolean)
        if (names.length) setSpeakers(names)
      })
      .catch(() => undefined)
    return () => controller.abort()
  }, [])

  const clearFilters = () => {
    setSearch('')
    setYear(ALL)
    setSpeaker(ALL)
    setCategory(ALL)
  }

  const hasActiveFilters = Boolean(search.trim() || year || speaker || category)
  const canLoadMore = totalPages !== null && page < totalPages

  const selectClass =
    'mt-2 w-full rounded-sm border border-ink/20 bg-white px-3 py-2.5 font-display text-sm font-semibold uppercase tracking-wider text-ink'

  return (
    <>
      <Seo
        title="Messages"
        description="Download teaching messages from Apostle Segun Obadje and Pastor Funke Obadje — New Creation realities, healing, faith and the supernatural."
      />

      <PageHeader
        eyebrow="The library"
        title="Messages"
        lede="Teaching that establishes. Search the full library, filter by year, minister or category, and download any message directly to your device."
      />

      <section className="bg-parchment">
        <div className="container-site py-14">
          {/* Filters */}
          <form
            role="search"
            aria-label="Search messages"
            className="card grid gap-4 p-5 sm:grid-cols-2 lg:grid-cols-4"
            onSubmit={(e) => e.preventDefault()}
          >
            <div className="sm:col-span-2 lg:col-span-1">
              <label htmlFor="msg-search" className="eyebrow">
                Search
              </label>
              <input
                id="msg-search"
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by title…"
                className="mt-2 w-full rounded-sm border border-ink/20 bg-white px-3 py-2.5"
              />
            </div>
            <div>
              <label htmlFor="msg-year" className="eyebrow">
                Year
              </label>
              <select id="msg-year" value={year} onChange={(e) => setYear(e.target.value)} className={selectClass}>
                <option value={ALL}>All years</option>
                {yearOptions().map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="msg-speaker" className="eyebrow">
                Minister
              </label>
              <select
                id="msg-speaker"
                value={speaker}
                onChange={(e) => setSpeaker(e.target.value)}
                className={selectClass}
              >
                <option value={ALL}>All ministers</option>
                {speakers.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="msg-category" className="eyebrow">
                Category
              </label>
              <select
                id="msg-category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className={selectClass}
              >
                <option value={ALL}>All categories</option>
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </form>

          {/* Result count */}
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <p className="font-display text-sm font-semibold uppercase tracking-wider text-ink-mute" aria-live="polite">
              {loading
                ? 'Loading the library…'
                : totalMessages !== null
                  ? `${totalMessages} ${totalMessages === 1 ? 'message' : 'messages'}`
                  : ''}
            </p>
            {hasActiveFilters && !loading && (
              <button type="button" onClick={clearFilters} className="font-display text-sm font-semibold uppercase tracking-wider text-plum underline-offset-4 hover:underline">
                Clear filters
              </button>
            )}
          </div>

          {/* Error state */}
          {error && !loading && (
            <div className="card mt-4 p-10 text-center">
              <p className="text-lg">{error}</p>
              <button type="button" className="btn-outline mt-6" onClick={() => void load(1, filters, false)}>
                Try again
              </button>
            </div>
          )}

          {/* Loading skeletons */}
          {loading && (
            <ul className="mt-4 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <CardSkeleton key={i} />
              ))}
            </ul>
          )}

          {/* Empty state */}
          {!loading && !error && messages.length === 0 && (
            <div className="card mt-4 p-10 text-center">
              <p className="text-lg">No messages match those filters yet.</p>
              <button type="button" className="btn-outline mt-6" onClick={clearFilters}>
                Clear filters
              </button>
            </div>
          )}

          {/* Results */}
          {!loading && !error && messages.length > 0 && (
            <>
              <ul className="mt-4 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {messages.map((m) => (
                  <li key={m._id}>
                    <MessageCard message={m} />
                  </li>
                ))}
              </ul>
              {canLoadMore && (
                <div className="mt-12 text-center">
                  <button
                    type="button"
                    className="btn-ink"
                    disabled={loadingMore}
                    onClick={() => void load(page + 1, filters, true)}
                  >
                    {loadingMore ? 'Loading…' : 'Load more messages'}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </>
  )
}
