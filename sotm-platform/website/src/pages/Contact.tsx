import { useState, type FormEvent } from 'react'
import Seo from '../components/Seo'
import Eyebrow from '../components/Eyebrow'
import Reveal from '../components/Reveal'
import PageHeader from '../components/PageHeader'
import { CONTACT_EMAIL, FORM_ENDPOINT, PRAYER_LINE_EMAIL, PRAYER_LINE_PHONE } from '../data'

type SendState = 'idle' | 'sending' | 'sent' | 'error'

const REASONS = ['General enquiry', 'Invitation — host SOTM in your location', 'Prayer request', 'Partnership', 'Testimony']

export default function Contact() {
  const [state, setState] = useState<SendState>('idle')

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!FORM_ENDPOINT) return
    const form = e.currentTarget
    setState('sending')
    try {
      const res = await fetch(FORM_ENDPOINT, {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: new FormData(form),
      })
      if (!res.ok) throw new Error(`Form endpoint responded ${res.status}`)
      form.reset()
      setState('sent')
    } catch {
      setState('error')
    }
  }

  const mailto = (subject: string) => `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}`
  const inputClass = 'mt-2 w-full rounded-sm border border-ink/20 bg-white px-3 py-2.5'

  return (
    <>
      <Seo
        title="Contact"
        description="Reach Segun Obadje Teaching Ministries — invitations, prayer requests, partnership and general enquiries."
      />

      <PageHeader
        eyebrow="Contact"
        title="We would love to hear from you."
        lede="Invitations, prayer requests, partnership or a testimony of what God has done — every message is read."
      />

      <section className="bg-parchment">
        <div className="container-site grid gap-12 py-16 lg:grid-cols-[1fr_1.2fr]">
          {/* Channels */}
          <div className="space-y-6">
            <Reveal className="card p-7">
              <Eyebrow>Email</Eyebrow>
              <a href={`mailto:${CONTACT_EMAIL}`} className="mt-3 block text-xl font-bold text-plum underline">
                {CONTACT_EMAIL}
              </a>
            </Reveal>
            {(PRAYER_LINE_PHONE || PRAYER_LINE_EMAIL) && (
              <Reveal delay={1} className="card p-7">
                <Eyebrow>Prayer line</Eyebrow>
                {PRAYER_LINE_PHONE && (
                  <a href={`tel:${PRAYER_LINE_PHONE.replace(/\s/g, '')}`} className="mt-3 block text-xl font-bold">
                    {PRAYER_LINE_PHONE}
                  </a>
                )}
                {PRAYER_LINE_EMAIL && (
                  <a href={`mailto:${PRAYER_LINE_EMAIL}`} className="mt-2 block text-lg font-bold text-plum underline">
                    {PRAYER_LINE_EMAIL}
                  </a>
                )}
              </Reveal>
            )}
            <Reveal delay={2} className="card p-7">
              <Eyebrow>Host SOTM</Eyebrow>
              <p className="mt-3 text-ink/80">
                To invite Apostle Segun or Pastor Funke Obadje to minister in your location, email an invitation with
                your church or organisation, city, proposed dates and contact details. The team will respond with
                hosting guidelines.
              </p>
              <a href={mailto('Invitation to host SOTM')} className="btn-outline mt-5 !px-4 !py-2 text-xs">
                Email an invitation
              </a>
            </Reveal>
          </div>

          {/* Form or honest fallback */}
          <div>
            {FORM_ENDPOINT ? (
              <Reveal className="card p-8">
                <Eyebrow>Send a message</Eyebrow>
                <form onSubmit={handleSubmit} className="mt-6 space-y-5">
                  <div>
                    <label htmlFor="c-name" className="font-bold">
                      Your name
                    </label>
                    <input id="c-name" name="name" type="text" required autoComplete="name" className={inputClass} />
                  </div>
                  <div>
                    <label htmlFor="c-email" className="font-bold">
                      Email address
                    </label>
                    <input id="c-email" name="email" type="email" required autoComplete="email" className={inputClass} />
                  </div>
                  <div>
                    <label htmlFor="c-reason" className="font-bold">
                      Reason
                    </label>
                    <select id="c-reason" name="reason" className={inputClass}>
                      {REASONS.map((r) => (
                        <option key={r}>{r}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="c-message" className="font-bold">
                      Message
                    </label>
                    <textarea id="c-message" name="message" required rows={6} className={inputClass} />
                  </div>
                  <button type="submit" className="btn-ink" disabled={state === 'sending'}>
                    {state === 'sending' ? 'Sending…' : 'Send message'}
                  </button>
                  <p aria-live="polite" className="font-display text-sm font-semibold uppercase tracking-wider">
                    {state === 'sent' && <span className="text-plum">Message sent. Thank you — the team will respond.</span>}
                    {state === 'error' && (
                      <span className="text-ink">
                        The message could not be sent. Please email{' '}
                        <a href={`mailto:${CONTACT_EMAIL}`} className="text-plum underline">
                          {CONTACT_EMAIL}
                        </a>{' '}
                        directly.
                      </span>
                    )}
                  </p>
                </form>
              </Reveal>
            ) : (
              <Reveal className="card p-8">
                <Eyebrow>Send us an email</Eyebrow>
                <p className="mt-4 text-lg text-ink/80">
                  Choose what you are writing about and your email app will open with the right subject line, addressed
                  to the team.
                </p>
                <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                  {REASONS.map((reason) => (
                    <li key={reason}>
                      <a href={mailto(reason)} className="btn-outline w-full !justify-start !px-4 !py-3 text-xs">
                        {reason}
                      </a>
                    </li>
                  ))}
                </ul>
              </Reveal>
            )}
          </div>
        </div>
      </section>
    </>
  )
}
