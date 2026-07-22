import { Link } from 'react-router-dom'
import Seo from '../components/Seo'
import Eyebrow from '../components/Eyebrow'
import Reveal from '../components/Reveal'
import PageHeader from '../components/PageHeader'
import { CONTACT_EMAIL } from '../data'

const PARTNER_WORKS = [
  {
    title: 'Spreading the Word',
    body: 'Partners put teaching into hands and homes — messages, broadcasts and over 650,000 free copies of The Leverage devotional across the nations.',
  },
  {
    title: 'Missions & outreach',
    body: 'From apostolic visits and healing schools to charity outreaches, partners carry the Gospel to cities and communities they may never visit in person.',
  },
  {
    title: 'Media & broadcasts',
    body: 'Morning Dew, Sphere of Grace, the Online Healing School and Bible Truths on Air reach the world daily because partners keep them on air.',
  },
]

const BENEFITS = [
  'Regular prayer cover from Apostle Segun and Pastor Funke Obadje',
  'Exclusive monthly partners’ resources and updates',
  'First notice of conferences, schools and special gatherings',
  'The joy of shared reward in every soul won and every life established (Philippians 4:17)',
]

export default function Partner() {
  return (
    <>
      <Seo
        title="Partner with SOTM"
        description="Partnership with Segun Obadje Teaching Ministries — spreading the Word, funding missions and media, and sharing in the reward of souls won across the nations."
      />

      <PageHeader
        eyebrow="Partnership"
        title="Go where you cannot go. Reach who you cannot reach."
        lede="Partnership with a teaching ministry is a covenant of shared assignment — your seed and prayers carry the Word to the nations, and you share in the reward of every life it touches."
      />

      {/* What partnership does */}
      <section className="bg-parchment">
        <div className="container-site py-16">
          <Reveal>
            <Eyebrow>What your partnership does</Eyebrow>
          </Reveal>
          <ul className="mt-8 grid gap-6 md:grid-cols-3">
            {PARTNER_WORKS.map((item, i) => (
              <Reveal as="li" key={item.title} delay={(i % 3) as 0 | 1 | 2} className="card p-7">
                <h2 className="text-xl font-bold">{item.title}</h2>
                <p className="mt-3 text-ink/80">{item.body}</p>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* Benefits */}
      <section className="bg-white">
        <div className="container-site grid gap-12 py-16 lg:grid-cols-2 lg:items-center">
          <Reveal>
            <Eyebrow>Partnership benefits</Eyebrow>
            <h2 className="mt-4 text-3xl font-extrabold sm:text-4xl">What partners receive</h2>
            <ul className="mt-6 space-y-4">
              {BENEFITS.map((benefit) => (
                <li key={benefit} className="flex gap-3 text-lg text-ink/80">
                  <span aria-hidden="true" className="mt-2 block h-[3px] w-6 shrink-0 bg-gold" />
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={1} className="card bg-ink p-10 text-parchment">
            <Eyebrow dark>Become a partner</Eyebrow>
            <h2 className="mt-4 text-2xl font-extrabold">Start today</h2>
            <p className="mt-4 text-parchment/80">
              Give your first partnership seed through any of the ministry accounts, then email{' '}
              <a href={`mailto:${CONTACT_EMAIL}`} className="font-bold text-gold-bright underline">
                {CONTACT_EMAIL}
              </a>{' '}
              with your name and location so the team can welcome you and add you to the partners&rsquo; family.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link to="/give" className="btn-gold">
                See giving details
              </Link>
              <Link to="/contact" className="btn-outline-light">
                Talk to the team
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  )
}
