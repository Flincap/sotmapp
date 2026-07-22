import { useEffect, useState } from 'react'
import { NavLink, Link, useLocation } from 'react-router-dom'
import { SITE_NAME, SITE_SHORT } from '../data'

const NAV = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/messages', label: 'Messages' },
  { to: '/platforms', label: 'Platforms' },
  { to: '/books', label: 'Books' },
  { to: '/events', label: 'Events' },
  { to: '/partner', label: 'Partner' },
  { to: '/contact', label: 'Contact' },
]

export default function Header() {
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()

  useEffect(() => {
    setOpen(false)
  }, [pathname])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `font-display text-[0.82rem] font-semibold uppercase tracking-wider transition-colors ${
      isActive ? 'text-plum' : 'text-ink hover:text-plum'
    }`

  return (
    <header className="sticky top-0 z-50 border-b border-ink/10 bg-parchment/95 backdrop-blur">
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <div className="container-site flex h-[4.5rem] items-center justify-between gap-6">
        <Link to="/" className="flex shrink-0 items-center gap-3" aria-label={`${SITE_NAME} — home`}>
          <img src="/images/logo.png" alt="" width={98} height={40} className="h-10 w-auto" />
          <span className="sr-only">{SITE_SHORT}</span>
        </Link>

        <nav aria-label="Main" className="hidden items-center gap-6 lg:flex">
          {NAV.map((item) => (
            <NavLink key={item.to} to={item.to} className={linkClass} end={item.to === '/'}>
              {item.label}
            </NavLink>
          ))}
          <NavLink to="/give" className="btn-gold !px-5 !py-2.5">
            Give
          </NavLink>
        </nav>

        <div className="flex items-center gap-3 lg:hidden">
          <NavLink to="/give" className="btn-gold !px-4 !py-2 text-xs">
            Give
          </NavLink>
          <button
            type="button"
            className="flex h-11 w-11 items-center justify-center rounded-sm border border-ink/20"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen((v) => !v)}
          >
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
              {open ? (
                <path d="M4 4l14 14M18 4L4 18" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
              ) : (
                <path d="M3 6h16M3 11h16M3 16h16" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {open && (
        <nav
          id="mobile-nav"
          aria-label="Main"
          className="max-h-[calc(100dvh-4.5rem)] overflow-y-auto border-t border-ink/10 bg-parchment lg:hidden"
        >
          <ul className="container-site flex flex-col py-4">
            {NAV.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  end={item.to === '/'}
                  className={({ isActive }) =>
                    `block border-b border-ink/5 py-3.5 font-display text-base font-semibold uppercase tracking-wider ${
                      isActive ? 'text-plum' : 'text-ink'
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  )
}
