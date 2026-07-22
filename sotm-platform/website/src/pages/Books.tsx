import Seo from '../components/Seo'
import Eyebrow from '../components/Eyebrow'
import Reveal from '../components/Reveal'
import PageHeader from '../components/PageHeader'
import Placeholder from '../components/Placeholder'
import { BOOKS, DOWNLOADS, LINKS } from '../data'

export default function Books() {
  return (
    <>
      <Seo
        title="Books & Resources"
        description="Books and devotionals by Apostle Segun Obadje and Pastor Funke Obadje — The Power of the Blessing, ZOE, The Leverage devotional and more."
      />

      <PageHeader
        eyebrow="Books & resources"
        title="Take the teaching home."
        lede="Life-transforming books and devotionals, in print and e-book — plus free study notes to dig deeper."
      />

      <section className="bg-parchment">
        <div className="container-site py-16">
          <ul className="grid grid-cols-2 gap-x-6 gap-y-12 md:grid-cols-3 lg:grid-cols-4">
            {BOOKS.map((book, i) => (
              <Reveal as="li" key={book.title} delay={(i % 4 > 2 ? 2 : i % 4) as 0 | 1 | 2} className="flex flex-col">
                {book.coverImage ? (
                  <img
                    src={book.coverImage}
                    alt={`Cover of ${book.title}`}
                    loading="lazy"
                    className="aspect-[3/4] w-full rounded-sm object-cover"
                  />
                ) : (
                  <Placeholder label="Cover" className="aspect-[3/4] w-full rounded-sm" />
                )}
                <h2 className="mt-4 text-lg font-bold leading-snug">{book.title}</h2>
                <p className="mt-1 text-sm text-ink-mute">{book.author}</p>
                <p className="mt-2 flex-1 text-sm text-ink/75">{book.blurb}</p>
                <a
                  href={book.link ?? LINKS.bookstore}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-outline mt-4 !px-4 !py-2 text-xs"
                >
                  Get it
                </a>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* Leverage devotional */}
      <section className="bg-plum-deep text-parchment">
        <div className="container-site flex flex-col items-start justify-between gap-8 py-16 md:flex-row md:items-center">
          <Reveal>
            <Eyebrow dark>Daily devotional</Eyebrow>
            <h2 className="mt-4 max-w-xl text-3xl font-extrabold">Receive The Leverage every day, free.</h2>
            <p className="mt-4 max-w-xl text-lg text-parchment/80">
              Over 650,000 copies distributed free of charge across Nigeria and the nations. Get it delivered daily on
              WhatsApp or Telegram.
            </p>
          </Reveal>
          <Reveal delay={1} className="flex shrink-0 flex-wrap gap-4">
            <a href={LINKS.leverageWhatsApp} target="_blank" rel="noopener noreferrer" className="btn-gold">
              Get it on WhatsApp
            </a>
            <a href={LINKS.leverageTelegram} target="_blank" rel="noopener noreferrer" className="btn-outline-light">
              Get it on Telegram
            </a>
          </Reveal>
        </div>
      </section>

      {/* Free downloads */}
      <section className="bg-white">
        <div className="container-site py-16">
          <Reveal>
            <Eyebrow>Free downloads</Eyebrow>
            <h2 className="mt-4 text-3xl font-extrabold">Study notes</h2>
          </Reveal>
          {DOWNLOADS.length === 0 ? (
            <Reveal delay={1} className="card mt-8 max-w-2xl p-8">
              <p className="text-lg text-ink/80">
                Free study notes are being prepared and will appear here soon. In the meantime, explore the{' '}
                <a href={LINKS.bookstore} target="_blank" rel="noopener noreferrer" className="font-bold text-plum underline">
                  SOTM bookstore
                </a>
                .
              </p>
            </Reveal>
          ) : (
            <ul className="mt-8 grid gap-6 md:grid-cols-2">
              {DOWNLOADS.map((d, i) => (
                <Reveal as="li" key={d.title} delay={(i % 2) as 0 | 1} className="card flex items-start justify-between gap-6 p-7">
                  <div>
                    <h3 className="text-xl font-bold">{d.title}</h3>
                    <p className="mt-2 text-ink/75">{d.description}</p>
                  </div>
                  <a href={d.fileUrl} download className="btn-ink shrink-0 !px-4 !py-2 text-xs">
                    Download
                  </a>
                </Reveal>
              ))}
            </ul>
          )}
        </div>
      </section>
    </>
  )
}
