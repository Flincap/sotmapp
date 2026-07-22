import { Link } from 'react-router-dom'
import { CONTACT_EMAIL, LINKS, SITE_NAME, SOCIALS } from '../data'

const SOCIAL_ICONS: Record<string, string> = {
  YouTube:
    'M21.6 7.2a2.7 2.7 0 0 0-1.9-1.9C18 4.8 12 4.8 12 4.8s-6 0-7.7.5A2.7 2.7 0 0 0 2.4 7.2 28.4 28.4 0 0 0 2 12c0 1.6.1 3.2.4 4.8a2.7 2.7 0 0 0 1.9 1.9c1.7.5 7.7.5 7.7.5s6 0 7.7-.5a2.7 2.7 0 0 0 1.9-1.9c.3-1.6.4-3.2.4-4.8s-.1-3.2-.4-4.8ZM10 15.2V8.8L15.2 12 10 15.2Z',
  Instagram:
    'M12 2.2c2.7 0 3 0 4 .1a5.4 5.4 0 0 1 5.7 5.6c.1 1 .1 1.4.1 4.1s0 3-.1 4.1a5.4 5.4 0 0 1-5.6 5.6c-1.1.1-1.4.1-4.1.1s-3 0-4.1-.1a5.4 5.4 0 0 1-5.6-5.6C2.2 15 2.2 14.7 2.2 12s0-3 .1-4.1a5.4 5.4 0 0 1 5.6-5.6c1.1-.1 1.4-.1 4.1-.1Zm0 1.8c-2.6 0-2.9 0-4 .1a3.6 3.6 0 0 0-3.9 3.9c-.1 1.1-.1 1.4-.1 4s0 2.9.1 4a3.6 3.6 0 0 0 3.9 3.9c1.1.1 1.4.1 4 .1s2.9 0 4-.1a3.6 3.6 0 0 0 3.9-3.9c.1-1.1.1-1.4.1-4s0-2.9-.1-4a3.6 3.6 0 0 0-3.9-3.9c-1.1-.1-1.4-.1-4-.1Zm0 3a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 1.8a3.2 3.2 0 1 0 0 6.4 3.2 3.2 0 0 0 0-6.4Zm5.2-3a1.2 1.2 0 1 1 0 2.4 1.2 1.2 0 0 1 0-2.4Z',
  Facebook:
    'M22 12a10 10 0 1 0-11.6 9.9v-7h-2.5V12h2.5V9.8c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.5h-1.3c-1.2 0-1.6.8-1.6 1.6V12h2.8l-.4 2.9h-2.4v7A10 10 0 0 0 22 12Z',
  X: 'M17.7 3H21l-7.3 8.3L22.2 21h-6.7l-5.2-6.3L4.4 21H1.1l7.8-8.9L1.5 3h6.9l4.7 5.8L17.7 3Zm-1.2 16h1.9L6.5 4.9H4.5L16.5 19Z',
  Telegram:
    'M21.9 4.3 18.7 19c-.2 1-.9 1.3-1.8.8l-4.9-3.6-2.4 2.3c-.3.3-.5.5-1 .5l.4-5 9.2-8.3c.4-.4-.1-.6-.6-.2L6.2 12.6 1.3 11c-1-.3-1-1 .2-1.5L20.5 2.6c.9-.3 1.7.2 1.4 1.7Z',
  Spotify:
    'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm4.6 14.4a.6.6 0 0 1-.9.2c-2.4-1.5-5.4-1.8-9-1a.6.6 0 1 1-.2-1.2c3.9-.9 7.2-.5 9.9 1.1.3.2.4.6.2.9Zm1.2-2.7a.8.8 0 0 1-1.1.3c-2.7-1.7-6.9-2.2-10.1-1.2a.8.8 0 1 1-.5-1.5c3.7-1.1 8.2-.6 11.4 1.3.4.2.5.7.3 1.1Zm.1-2.8C14.7 9 9.4 8.8 6.3 9.7a1 1 0 1 1-.5-1.8c3.5-1.1 9.4-.9 13.1 1.3a1 1 0 0 1-1 1.7Z',
}

export default function Footer() {
  const year = new Date().getFullYear()
  const socials = SOCIALS.filter((s) => s.url)

  return (
    <footer className="bg-ink text-parchment">
      <div className="container-site grid gap-12 py-16 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <img src="/images/logo-light.png" alt={`${SITE_NAME} logo`} width={132} height={54} className="h-12 w-auto" />
          <p className="mt-5 max-w-sm text-parchment/70">
            Taking the Gospel of Christ to the ends of the world, revealing the healing and miracle presence and power
            of Jesus Christ.
          </p>
          {socials.length > 0 && (
            <ul className="mt-6 flex gap-4">
              {socials.map((s) => (
                <li key={s.name}>
                  <a
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${SITE_NAME} on ${s.name}`}
                    className="flex h-10 w-10 items-center justify-center rounded-sm border border-parchment/25 text-parchment/80 transition-colors hover:border-gold-bright hover:text-gold-bright"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <path d={SOCIAL_ICONS[s.name]} />
                    </svg>
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>

        <nav aria-label="Footer">
          <h2 className="eyebrow-dark">
            Explore
            <span className="blade" aria-hidden="true" />
          </h2>
          <ul className="mt-5 space-y-3">
            {[
              ['/about', 'About the ministry'],
              ['/messages', 'Messages'],
              ['/platforms', 'Ministry platforms'],
              ['/books', 'Books & resources'],
              ['/events', 'Events & itinerary'],
              ['/partner', 'Partner with us'],
              ['/give', 'Give'],
              ['/contact', 'Contact'],
            ].map(([to, label]) => (
              <li key={to}>
                <Link to={to} className="text-parchment/70 transition-colors hover:text-gold-bright">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className="eyebrow-dark">
            SOTM worldwide
            <span className="blade" aria-hidden="true" />
          </h2>
          <ul className="mt-5 space-y-3">
            <li>
              <a
                href={LINKS.sotmUK}
                target="_blank"
                rel="noopener noreferrer"
                className="text-parchment/70 transition-colors hover:text-gold-bright"
              >
                SOTM United Kingdom
              </a>
            </li>
            <li>
              <a
                href={LINKS.sotmNA}
                target="_blank"
                rel="noopener noreferrer"
                className="text-parchment/70 transition-colors hover:text-gold-bright"
              >
                SOTM North America
              </a>
            </li>
            <li>
              <a
                href={LINKS.bookstore}
                target="_blank"
                rel="noopener noreferrer"
                className="text-parchment/70 transition-colors hover:text-gold-bright"
              >
                SOTM bookstore
              </a>
            </li>
            <li>
              <a href={`mailto:${CONTACT_EMAIL}`} className="text-parchment/70 transition-colors hover:text-gold-bright">
                {CONTACT_EMAIL}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-parchment/10">
        <div className="container-site flex flex-col items-start justify-between gap-2 py-6 text-sm text-parchment/50 sm:flex-row">
          <p>
            © {year} {SITE_NAME}. All rights reserved.
          </p>
          <p>Jesus Christ is Lord.</p>
        </div>
      </div>
    </footer>
  )
}
