import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Seo from '../components/Seo'
import Eyebrow from '../components/Eyebrow'
import Reveal from '../components/Reveal'
import Placeholder from '../components/Placeholder'
import MessageCard from '../components/MessageCard'
import { fetchFeatured, fetchMessages, type ApiMessage } from '../lib/api'
import {
  BOOKS,
  EVENTS,
  IMPACT,
  LINKS,
  MISSION,
  MISSION_REF,
  SITE_DESCRIPTION,
  VISION,
  VISION_REF,
} from '../data'

export default function Home() {
  const upcoming = EVENTS.slice(0, 3)
  const featuredBooks = BOOKS.slice(0, 4)

  // Featured messages from the sermon library, falling back to the latest
  // uploads if nothing is flagged as featured yet. Fails silently — the
  // homepage must never break because the API is briefly unreachable.
  const [latest, setLatest] = useState<ApiMessage[]>([])
  useEffect(() => {
    const controller = new AbortController()
    fetchFeatured(controller.signal)
      .then((featured) => {
        if (featured.length > 0) {
          setLatest(featured.slice(0, 3))
          return null
        }
        return fetchMessages(1, {}, { field: 'date', order: 'desc' }, controller.signal)
      })
      .then((page) => {
        if (page) setLatest(page.data.slice(0, 3))
      })
      .catch(() => undefined)
    return () => controller.abort()
  }, [])

  return (
    <>
      <Seo title="Teaching New Creation Realities" description={SITE_DESCRIPTION} />

      {/* Hero — photo-led, no video. Copy on the left, portrait staged on the
          right against the ink gradient with the gold blade accent. */}
      <section className="relative isolate overflow-hidden bg-ink text-parchment">
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-[radial-gradient(70%_90%_at_78%_12%,#3a2d5c_0%,#221a38_45%,#171226_100%)]"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 opacity-[0.35] [background-image:linear-gradient(rgba(247,244,238,0.05)_1px,transparent_1px)] [background-size:100%_5px]"
        />

        <div className="container-site grid min-h-[82vh] items-center gap-10 pb-14 pt-16 lg:grid-cols-[1.15fr_0.85fr] lg:gap-14 lg:pb-0 lg:pt-10">
          <div className="order-2 lg:order-1">
            <Reveal>
              <Eyebrow dark>Segun Obadje Teaching Ministries</Eyebrow>
            </Reveal>
            <Reveal delay={1}>
              <h1 className="mt-5 max-w-3xl font-display text-4xl font-extrabold leading-[1.03] sm:text-6xl lg:text-[4.25rem]">
                Teaching New Creation realities with simplicity and clarity.
              </h1>
            </Reveal>
            <Reveal delay={2}>
              <p className="mt-7 max-w-2xl text-lg text-parchment/80 sm:text-xl">
                An apostolic and prophetic ministry preaching the glorious Gospel of Christ across the nations for
                over two decades — with healings, miracles and lives established in the Word.
              </p>
            </Reveal>
            <Reveal delay={3}>
              <div className="mt-10 flex flex-wrap gap-4">
                <Link to="/messages" className="btn-gold">
                  Download messages
                </Link>
                <Link to="/partner" className="btn-outline-light">
                  Partner with us
                </Link>
              </div>
            </Reveal>
          </div>

          <Reveal delay={1} className="order-1 lg:order-2 lg:self-end">
            <figure className="relative mx-auto max-w-[19rem] sm:max-w-sm lg:max-w-none">
              <span
                aria-hidden="true"
                className="absolute -inset-x-6 bottom-0 top-10 -z-10 rounded-sm bg-gradient-to-t from-gold/25 via-plum/20 to-transparent"
              />
              <img
                src="/images/apostle-segun-obadje.webp"
                alt="Apostle Segun Obadje"
                width={900}
                height={1100}
                {...({ fetchpriority: 'high' } as Record<string, string>)}
                className="w-full object-cover object-top [mask-image:linear-gradient(to_bottom,black_86%,transparent_100%)]"
              />
              <figcaption className="absolute bottom-5 left-0 border-l-[3px] border-gold pl-3 font-display text-xs font-semibold uppercase tracking-[0.2em] text-parchment/90">
                Apostle Segun Obadje
              </figcaption>
            </figure>
          </Reveal>
        </div>

        {/* Impact strip anchors the hero without needing motion or video */}
        <div className="border-t border-parchment/10 bg-ink/60 backdrop-blur">
          <dl className="container-site grid grid-cols-2 gap-x-6 gap-y-8 py-8 md:grid-cols-4">
            {IMPACT.map((item, i) => (
              <Reveal as="div" key={item.label} delay={(i % 4 > 2 ? 3 : i % 4) as 0 | 1 | 2 | 3}>
                <dt className="sr-only">{item.label}</dt>
                <dd>
                  <span className="block font-display text-3xl font-extrabold text-gold-bright sm:text-4xl">
                    {item.figure}
                  </span>
                  <span className="mt-1 block text-sm text-parchment/70">{item.label}</span>
                </dd>
              </Reveal>
            ))}
          </dl>
        </div>
      </section>

      {/* Latest messages — live from the sermon library */}
      {latest.length > 0 && (
        <section className="border-b border-ink/10 bg-white">
          <div className="container-site py-20">
            <Reveal className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <Eyebrow>Fresh from the library</Eyebrow>
                <h2 className="mt-4 text-3xl font-extrabold sm:text-4xl">Latest messages</h2>
              </div>
              <Link to="/messages" className="btn-outline">
                Browse the library
              </Link>
            </Reveal>
            <ul className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {latest.map((m, i) => (
                <Reveal as="li" key={m._id} delay={(i % 3) as 0 | 1 | 2}>
                  <MessageCard message={m} />
                </Reveal>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* About strip */}
      <section className="bg-parchment">
        <div className="container-site grid gap-12 py-20 lg:grid-cols-[1fr_1.1fr] lg:items-center">
          <Reveal>
            <img
              src="/images/apostle-segun-and-funke-obadje.webp"
              alt="Apostle Segun Obadje and Pastor Funke Obadje"
              width={1200}
              height={1500}
              loading="lazy"
              className="w-full max-w-md rounded-sm"
            />
          </Reveal>
          <Reveal delay={1}>
            <Eyebrow>The ministry</Eyebrow>
            <h2 className="mt-4 text-3xl font-extrabold sm:text-4xl">
              Souls won. Saints established. Nations reached.
            </h2>
            <p className="mt-5 text-lg text-ink/80">
              SOTM is the global teaching ministry of Apostle Segun Obadje and Pastor Funke Obadje. For well over two
              decades, the ministry has been involved in the active and aggressive preaching of the glorious Gospel of
              Christ — across Nigeria and far beyond its shores.
            </p>
            <p className="mt-4 text-lg text-ink/80">
              Our joy is to see souls won into the Kingdom of God and God&rsquo;s precious people established in the
              knowledge of His Word, enjoying the full blessings of the redemptive work of Christ.
            </p>
            <Link to="/about" className="btn-outline mt-8">
              Meet Apostle Segun & Pastor Funke
            </Link>
          </Reveal>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="bg-ink text-parchment">
        <div className="container-site grid gap-12 py-20 md:grid-cols-2">
          <Reveal>
            <Eyebrow dark>Our vision</Eyebrow>
            <p className="mt-5 font-display text-2xl font-bold leading-snug sm:text-[1.7rem]">{VISION}</p>
            <p className="mt-4 text-sm uppercase tracking-wider text-parchment/50">{VISION_REF}</p>
          </Reveal>
          <Reveal delay={1}>
            <Eyebrow dark>Our mission</Eyebrow>
            <p className="mt-5 font-display text-2xl font-bold leading-snug sm:text-[1.7rem]">{MISSION}</p>
            <p className="mt-4 text-sm uppercase tracking-wider text-parchment/50">{MISSION_REF}</p>
          </Reveal>
        </div>
      </section>

      {/* Upcoming events */}
      <section className="bg-parchment">
        <div className="container-site py-20">
          <Reveal className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <Eyebrow>Upcoming</Eyebrow>
              <h2 className="mt-4 text-3xl font-extrabold sm:text-4xl">Meetings & itinerary</h2>
            </div>
            <Link to="/events" className="btn-outline">
              All events
            </Link>
          </Reveal>
          <ul className="mt-10 grid gap-6 md:grid-cols-3">
            {upcoming.map((event, i) => (
              <Reveal as="li" key={event.title} delay={(i % 3) as 0 | 1 | 2} className="card flex flex-col p-6">
                <p className="eyebrow">{event.dateLabel}</p>
                <h3 className="mt-3 text-xl font-bold">{event.title}</h3>
                <p className="mt-2 text-ink/70">
                  {event.city} · {event.venue}
                </p>
                {event.placeholder && (
                  <p className="mt-3 font-display text-xs font-semibold uppercase tracking-wider text-plum">
                    Placeholder — details coming
                  </p>
                )}
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* Partner CTA */}
      <section className="bg-plum-deep text-parchment">
        <div className="container-site flex flex-col items-start gap-8 py-20 md:flex-row md:items-center md:justify-between">
          <Reveal>
            <Eyebrow dark>Partnership</Eyebrow>
            <h2 className="mt-4 max-w-xl text-3xl font-extrabold sm:text-4xl">
              Take the Gospel further than you could ever go alone.
            </h2>
            <p className="mt-4 max-w-xl text-lg text-parchment/80">
              Partners carry this ministry — spreading the Word, funding missions and putting teaching into hands and
              homes across the nations.
            </p>
          </Reveal>
          <Reveal delay={1} className="flex shrink-0 flex-wrap gap-4">
            <Link to="/partner" className="btn-gold">
              Become a partner
            </Link>
            <Link to="/give" className="btn-outline-light">
              Give today
            </Link>
          </Reveal>
        </div>
      </section>

      {/* Books strip */}
      <section className="bg-white">
        <div className="container-site py-20">
          <Reveal className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <Eyebrow>From the bookshelf</Eyebrow>
              <h2 className="mt-4 text-3xl font-extrabold sm:text-4xl">Books that build lives</h2>
            </div>
            <a href={LINKS.bookstore} target="_blank" rel="noopener noreferrer" className="btn-outline">
              Visit the bookstore
            </a>
          </Reveal>
          <ul className="mt-10 grid grid-cols-2 gap-6 lg:grid-cols-4">
            {featuredBooks.map((book, i) => (
              <Reveal as="li" key={book.title} delay={(i % 4 > 2 ? 2 : i % 4) as 0 | 1 | 2}>
                {book.coverImage ? (
                  <img src={book.coverImage} alt={`${book.title} cover`} loading="lazy" className="aspect-[3/4] w-full rounded-sm object-cover" />
                ) : (
                  <Placeholder label="Cover" className="aspect-[3/4] w-full rounded-sm" />
                )}
                <h3 className="mt-4 text-lg font-bold leading-snug">{book.title}</h3>
                <p className="mt-1 text-sm text-ink-mute">{book.author}</p>
              </Reveal>
            ))}
          </ul>
          <Reveal className="mt-8">
            <Link to="/books" className="btn-ink">
              Browse all books
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  )
}
