import { Link } from 'react-router-dom'
import Seo from '../components/Seo'
import Eyebrow from '../components/Eyebrow'
import Reveal from '../components/Reveal'
import PageHeader from '../components/PageHeader'
import { EVENTS } from '../data'

export default function Events() {
  const events = [...EVENTS].sort((a, b) => a.isoDate.localeCompare(b.isoDate))

  return (
    <>
      <Seo
        title="Events & Itinerary"
        description="Upcoming meetings and conferences of SOTM, and where Apostle Segun Obadje and Pastor Funke Obadje are ministering next."
      />

      <PageHeader
        eyebrow="Events & itinerary"
        title="Where the Word goes next."
        lede="Upcoming conferences, meetings and ministry visits. Placeholder cards below will be replaced with confirmed dates."
      />

      <section className="bg-parchment">
        <div className="container-site py-16">
          <ul className="space-y-6">
            {events.map((event, i) => (
              <Reveal
                as="li"
                key={`${event.title}-${event.isoDate}`}
                delay={(i % 2) as 0 | 1}
                className="card grid gap-6 p-7 md:grid-cols-[10rem_1fr_auto] md:items-center"
              >
                <div>
                  <p className="eyebrow">{event.dateLabel}</p>
                </div>
                <div>
                  <h2 className="text-2xl font-bold leading-snug">{event.title}</h2>
                  <p className="mt-2 text-ink/70">
                    {event.city} · {event.venue} · Hosted by {event.host}
                  </p>
                  {event.placeholder && (
                    <p className="mt-2 font-display text-xs font-semibold uppercase tracking-wider text-plum">
                      Placeholder — confirmed details coming
                    </p>
                  )}
                </div>
                <Link to="/contact" className="btn-outline justify-self-start md:justify-self-end">
                  Details & attend
                </Link>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* Host CTA */}
      <section className="bg-ink text-parchment">
        <div className="container-site flex flex-col items-start justify-between gap-8 py-16 md:flex-row md:items-center">
          <Reveal>
            <Eyebrow dark>Host SOTM</Eyebrow>
            <h2 className="mt-4 max-w-xl text-3xl font-extrabold">
              Invite Apostle Segun or Pastor Funke to your city.
            </h2>
            <p className="mt-4 max-w-xl text-lg text-parchment/75">
              Churches, conferences and campus fellowships across the nations host SOTM meetings. Send an invitation
              and the team will follow up with hosting guidelines.
            </p>
          </Reveal>
          <Reveal delay={1}>
            <Link to="/contact" className="btn-gold">
              Send an invitation
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  )
}
