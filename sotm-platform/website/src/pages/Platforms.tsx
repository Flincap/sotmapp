import Seo from '../components/Seo'
import Eyebrow from '../components/Eyebrow'
import Reveal from '../components/Reveal'
import PageHeader from '../components/PageHeader'
import { PLATFORMS } from '../data'

const CATEGORIES = ['Conferences & Events', 'Schools & Mentoring', 'Online Programs', 'Outreach'] as const

export default function Platforms() {
  return (
    <>
      <Seo
        title="Ministry Platforms"
        description="Conferences, schools of ministry, mentoring programmes, daily online broadcasts and outreaches of Segun Obadje Teaching Ministries."
      />

      <PageHeader
        eyebrow="Ministry platforms"
        title="Many streams. One river."
        lede="Conferences, schools, daily broadcasts and outreaches — every platform of SOTM exists to win souls and establish God's people in His Word."
      />

      <div className="bg-parchment">
        <div className="container-site space-y-16 py-16">
          {CATEGORIES.map((category) => {
            const items = PLATFORMS.filter((p) => p.category === category)
            return (
              <section key={category} aria-label={category}>
                <Reveal>
                  <Eyebrow>{category}</Eyebrow>
                </Reveal>
                <ul className="mt-6 grid gap-6 md:grid-cols-2">
                  {items.map((platform, i) => (
                    <Reveal as="li" key={platform.name} delay={(i % 2) as 0 | 1} className="card p-7">
                      <h2 className="text-xl font-bold leading-snug">{platform.name}</h2>
                      <p className="mt-3 text-ink/80">{platform.description}</p>
                      {platform.links && platform.links.length > 0 && (
                        <div className="mt-5 flex flex-wrap gap-3">
                          {platform.links.map((link) => (
                            <a
                              key={link.url}
                              href={link.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="btn-outline !px-4 !py-2 text-xs"
                            >
                              {link.label}
                            </a>
                          ))}
                        </div>
                      )}
                    </Reveal>
                  ))}
                </ul>
              </section>
            )
          })}
        </div>
      </div>
    </>
  )
}
