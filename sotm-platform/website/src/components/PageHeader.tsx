import Eyebrow from './Eyebrow'
import Reveal from './Reveal'

interface PageHeaderProps {
  eyebrow: string
  title: string
  lede?: string
}

/** Staged dark page header used on every inner page. */
export default function PageHeader({ eyebrow, title, lede }: PageHeaderProps) {
  return (
    <header className="bg-ink text-parchment">
      <div className="container-site py-16 sm:py-20">
        <Reveal>
          <Eyebrow dark>{eyebrow}</Eyebrow>
        </Reveal>
        <Reveal delay={1}>
          <h1 className="mt-4 max-w-3xl font-display text-4xl font-extrabold leading-[1.05] sm:text-5xl lg:text-6xl">
            {title}
          </h1>
        </Reveal>
        {lede && (
          <Reveal delay={2}>
            <p className="mt-6 max-w-2xl text-lg text-parchment/75">{lede}</p>
          </Reveal>
        )}
      </div>
    </header>
  )
}
