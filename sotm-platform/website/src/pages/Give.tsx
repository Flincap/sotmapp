import Seo from '../components/Seo'
import Eyebrow from '../components/Eyebrow'
import Reveal from '../components/Reveal'
import PageHeader from '../components/PageHeader'
import { GIVING, LINKS, ZELLE_PAYPAL_EMAIL } from '../data'

export default function Give() {
  return (
    <>
      <Seo
        title="Give"
        description="Sow into the work of Segun Obadje Teaching Ministries — giving details for Naira, Dollars and Pounds, plus Zelle and PayPal."
      />

      <PageHeader
        eyebrow="Give"
        title="Sow into the Gospel going to the nations."
        lede="Every seed carries the Word further — souls won, saints established, the sick healed. Thank you for giving."
      />

      {/* Online giving */}
      <section className="bg-parchment">
        <div className="container-site py-14">
          {LINKS.onlineGiving ? (
            <Reveal className="card flex flex-col items-start justify-between gap-6 bg-ink p-10 text-parchment md:flex-row md:items-center">
              <div>
                <Eyebrow dark>Give online</Eyebrow>
                <h2 className="mt-3 text-2xl font-extrabold">The fastest way to give</h2>
              </div>
              <a href={LINKS.onlineGiving} target="_blank" rel="noopener noreferrer" className="btn-gold">
                Give online now
              </a>
            </Reveal>
          ) : (
            <Reveal className="card border-dashed p-8">
              <p className="font-display text-xs font-semibold uppercase tracking-[0.2em] text-ink-mute">
                [Online giving link] — a secure online giving button will appear here once the payment link is added.
              </p>
            </Reveal>
          )}

          {/* Bank details */}
          <Reveal className="mt-12">
            <Eyebrow>Bank transfer</Eyebrow>
            <h2 className="mt-4 text-3xl font-extrabold">Ministry accounts</h2>
          </Reveal>
          <ul className="mt-8 grid gap-6 md:grid-cols-2">
            {GIVING.map((account, i) => (
              <Reveal as="li" key={`${account.bank}-${account.accountNumber}`} delay={(i % 2) as 0 | 1} className="card p-7">
                <p className="eyebrow">{account.currency}</p>
                <h3 className="mt-3 text-xl font-bold">{account.bank}</h3>
                <dl className="mt-4 space-y-2 text-lg">
                  <div className="flex flex-wrap justify-between gap-2">
                    <dt className="text-ink-mute">Account name</dt>
                    <dd className="font-bold">{account.accountName}</dd>
                  </div>
                  <div className="flex flex-wrap justify-between gap-2">
                    <dt className="text-ink-mute">Account number</dt>
                    <dd className="font-bold tabular-nums">{account.accountNumber}</dd>
                  </div>
                </dl>
                {account.extra && <p className="mt-3 text-ink/70">{account.extra}</p>}
              </Reveal>
            ))}
          </ul>

          {/* Zelle & PayPal */}
          <Reveal className="card mt-6 flex flex-col items-start justify-between gap-4 p-7 md:flex-row md:items-center">
            <div>
              <p className="eyebrow">Zelle & PayPal</p>
              <p className="mt-2 text-lg">
                Send to <span className="font-bold">{ZELLE_PAYPAL_EMAIL}</span>
              </p>
            </div>
            <p className="text-ink-mute">Reference: SOTM Partnership</p>
          </Reveal>

          <Reveal className="mt-12 max-w-2xl">
            <p className="text-lg text-ink/80">
              &ldquo;Not because I desire a gift: but I desire fruit that may abound to your account.&rdquo;
            </p>
            <p className="mt-2 font-display text-sm font-semibold uppercase tracking-wider text-ink-mute">
              Philippians 4:17
            </p>
          </Reveal>
        </div>
      </section>
    </>
  )
}
