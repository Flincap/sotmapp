import Seo from '../components/Seo'
import Eyebrow from '../components/Eyebrow'
import Reveal from '../components/Reveal'
import PageHeader from '../components/PageHeader'
import { IMPACT, LINKS, MISSION, MISSION_REF, VISION, VISION_REF } from '../data'

export default function About() {
  return (
    <>
      <Seo
        title="About the Ministry"
        description="The story and mandate of Segun Obadje Teaching Ministries — and the lives of Apostle Segun Obadje and Pastor Funke Obadje."
      />

      <PageHeader
        eyebrow="About SOTM"
        title="An apostolic and prophetic ministry with a mandate for the nations."
        lede="For well over two decades, SOTM has been involved in the active and aggressive preaching of the glorious Gospel of Christ — across Nigeria and far beyond its shores."
      />

      {/* Story + vision */}
      <section className="bg-parchment">
        <div className="container-site grid gap-14 py-20 lg:grid-cols-[1.2fr_1fr]">
          <Reveal>
            <Eyebrow>Our story</Eyebrow>
            <h2 className="mt-4 text-3xl font-extrabold sm:text-4xl">Why we do what we do</h2>
            <div className="mt-6 space-y-5 text-lg text-ink/80">
              <p>
                Segun Obadje Teaching Ministries (SOTM) is an apostolic and prophetic ministry which has been involved
                in the active and aggressive preaching of the glorious Gospel of Christ for well over two decades. As a
                ministry, we have been privileged to preach the Gospel of Christ not only across Nigeria, but also
                beyond its shores.
              </p>
              <p>
                Above all, our joy as a ministry is to see souls won into the Kingdom of God and to see God&rsquo;s
                precious people established in the knowledge of His Word. We can&rsquo;t help but love God&rsquo;s
                precious people; hence, we long in our bowels to see them enjoy the full blessings of the redemptive
                work of Christ.
              </p>
            </div>
          </Reveal>
          <div className="space-y-8">
            <Reveal delay={1} className="card p-8">
              <Eyebrow>Our vision</Eyebrow>
              <p className="mt-4 font-display text-xl font-bold leading-snug">{VISION}</p>
              <p className="mt-3 text-sm uppercase tracking-wider text-ink-mute">{VISION_REF}</p>
            </Reveal>
            <Reveal delay={2} className="card p-8">
              <Eyebrow>Our mission</Eyebrow>
              <p className="mt-4 font-display text-xl font-bold leading-snug">{MISSION}</p>
              <p className="mt-3 text-sm uppercase tracking-wider text-ink-mute">{MISSION_REF}</p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Impact */}
      <section className="bg-ink text-parchment">
        <div className="container-site py-16">
          <Reveal>
            <Eyebrow dark>Our impact</Eyebrow>
          </Reveal>
          <ul className="mt-8 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {IMPACT.map((item, i) => (
              <Reveal as="li" key={item.label} delay={(i % 4 > 2 ? 3 : i % 4) as 0 | 1 | 2 | 3}>
                <p className="font-display text-5xl font-extrabold text-gold-bright">{item.figure}</p>
                <p className="mt-2 text-parchment/70">{item.label}</p>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* Meet the President */}
      <section className="bg-white" aria-labelledby="president">
        <div className="container-site grid gap-12 py-20 lg:grid-cols-[1fr_1.4fr] lg:items-start">
          <Reveal>
            <img
              src="/images/apostle-segun-obadje.webp"
              alt="Apostle Segun Obadje, President of Segun Obadje Teaching Ministries"
              width={809}
              height={1456}
              loading="lazy"
              className="w-full max-w-sm rounded-sm bg-parchment"
            />
          </Reveal>
          <Reveal delay={1}>
            <Eyebrow>Meet the President</Eyebrow>
            <h2 id="president" className="mt-4 text-3xl font-extrabold sm:text-4xl">
              Apostle Segun Obadje
            </h2>
            <div className="mt-6 space-y-5 text-lg text-ink/80">
              <p>
                Apostle Segun Obadje is the President of Segun Obadje Teaching Ministries (SOTM) and the Set-Man of
                God&rsquo;s Love Tabernacle International Church (GLT) Worldwide. He is a renowned apostle of the Lord
                Jesus Christ with a divine mandate to reach the ends of the earth with the message of the New Creation
                realities in Christ Jesus, communicating the healing presence and power of Jesus Christ to the nations.
              </p>
              <p>
                His teaching and apostolic ministry, spanning almost three decades, has reached across Nigeria and many
                nations beyond, accompanied by undeniable demonstrations of the miraculous and countless testimonies of
                God&rsquo;s faithfulness. Through his apostolic ministry, God has established more than twenty churches
                across Nigeria, Ghana, the United States, Canada and the United Kingdom.
              </p>
              <p>
                He is the convener of Morning Dew, an online prayer altar that has blessed thousands of people around
                the world over the past six years, and he hosts regular apostolic and teaching meetings across Nigeria
                and internationally. He communicates God&rsquo;s message with a strong teaching anointing, remarkable
                simplicity and exceptional clarity — making profound biblical truths practical and easy to understand.
              </p>
              <p>
                By profession, Apostle Segun Obadje is a registered builder and holds a Ph.D. in Building Structures. He
                formerly served as a lecturer at Obafemi Awolowo University, Ile-Ife, before resigning to answer
                God&rsquo;s call into full-time ministry.
              </p>
              <p>
                An accomplished author, he has written numerous life-transforming books — including{' '}
                <em>The Power of the Blessing</em>, <em>Biblical Keys to Protection</em>, <em>ZOE</em>,{' '}
                <em>Realities of the New Man in Christ</em> and <em>The Business of Soul Winning</em> — and{' '}
                <em>The Leverage</em>, a daily devotional with over 650,000 copies distributed free of charge across
                Nigeria and several other nations.
              </p>
              <p>
                Apostle Segun Obadje is happily married to Pastor (Dr.) Olufunke Obadje, who serves alongside him as a
                pastor at God&rsquo;s Love Tabernacle (GLT) Church and as the Vice President of SOTM.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Meet the Vice President */}
      <section className="bg-parchment" aria-labelledby="vice-president">
        <div className="container-site grid gap-12 py-20 lg:grid-cols-[1.4fr_1fr] lg:items-start">
          <Reveal className="order-2 lg:order-1">
            <Eyebrow>Meet the Vice President</Eyebrow>
            <h2 id="vice-president" className="mt-4 text-3xl font-extrabold sm:text-4xl">
              Pastor (Dr.) Olufunke Obadje
            </h2>
            <div className="mt-6 space-y-5 text-lg text-ink/80">
              <p>
                Pastor (Dr.) Olufunke Obadje is the Vice President of Segun Obadje Teaching Ministries (SOTM). She is
                called, anointed and commissioned by God to reach the ends of the earth with the Gospel of Christ and
                the power of God.
              </p>
              <p>
                A devoted lover of God, a passionate preacher and a prophet with a strong evangelistic grace, her
                ministry is characterised by notable manifestations of the supernatural through signs, wonders,
                healings and diverse miracles. Her passion to see the supernatural power of God made manifest on the
                earth is evident, inspiring and contagious.
              </p>
              <p>
                She is a seasoned administrator, a large-hearted pastor and a gifted minister with profound prophetic
                insight into God&rsquo;s Word and a unique grace for counsel. A medical doctor by training, she is
                wholly devoted to the service of God and the advancement of His Kingdom.
              </p>
              <p>
                She is the visionary behind REFINED, an annual mentoring programme through which thousands of women in
                ministry have been trained and equipped to love God passionately, discover their purpose and fulfil
                their divine calling. She also oversees the Segun and Funke Obadje Mentoring School (SAFOMS) alongside
                her husband, and convenes the All Ladies Word and Worship Conference (ALWWC), a life-transforming
                gathering that has impacted countless women.
              </p>
              <p>
                Pastor Funke Obadje is the author of <em>Pure Milk</em> and <em>Pregnancy Companion</em>. She serves
                alongside her husband as Senior Pastor of God&rsquo;s Love Tabernacle (GLT) Worldwide, faithfully
                advancing the vision of the ministry through the preaching of God&rsquo;s Word, leadership development
                and the demonstration of His power.
              </p>
            </div>
          </Reveal>
          <Reveal delay={1} className="order-1 lg:order-2">
            <img
              src="/images/pastor-funke-obadje.webp"
              alt="Pastor Funke Obadje, Vice President of Segun Obadje Teaching Ministries"
              width={1000}
              height={1832}
              loading="lazy"
              className="w-full max-w-sm rounded-sm bg-white"
            />
          </Reveal>
        </div>
      </section>

      {/* GLT link block */}
      <section className="bg-ink text-parchment">
        <div className="container-site flex flex-col items-start justify-between gap-6 py-14 md:flex-row md:items-center">
          <Reveal>
            <Eyebrow dark>The local church</Eyebrow>
            <p className="mt-4 max-w-2xl text-xl">
              Apostle Segun Obadje is the Set-Man of God&rsquo;s Love Tabernacle (GLT) International Church, Lekki.
            </p>
          </Reveal>
          <Reveal delay={1}>
            <a href={LINKS.glt} target="_blank" rel="noopener noreferrer" className="btn-gold">
              Visit the GLT website
            </a>
          </Reveal>
        </div>
      </section>
    </>
  )
}
