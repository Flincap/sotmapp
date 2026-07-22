/* =========================================================================
   SOTM WEBSITE CONTENT
   Everything editable lives in this one file. Update content here and the
   whole site updates. You never need to touch a component.
   Placeholders you must replace are marked with: TODO
   ========================================================================= */

/* ---------- Site constants ---------- */

// TODO: swap this when the real domain is attached (used for SEO, canonical
// URLs and share links). No trailing slash.
export const SITE_URL = 'https://segunobadje.org'

export const SITE_NAME = 'Segun Obadje Teaching Ministries'
export const SITE_SHORT = 'SOTM'

export const SITE_DESCRIPTION =
  'Segun Obadje Teaching Ministries (SOTM) — an apostolic and prophetic teaching ministry taking the Gospel of Christ to the nations, revealing the healing and miracle power of Jesus.'

/* ---------- Contact ---------- */

// TODO: replace with the real ministry email and prayer line
export const CONTACT_EMAIL = 'info@segunobadje.org'
export const PRAYER_LINE_PHONE: string = '' // e.g. '+234 800 000 0000' — hidden until filled
export const PRAYER_LINE_EMAIL: string = '' // e.g. 'prayer@segunobadje.org' — hidden until filled

// Optional form endpoint (e.g. Formspree: 'https://formspree.io/f/xxxxxxx').
// Leave empty and the Contact page shows "Send us an email" buttons instead,
// so nothing is ever silently dropped.
export const FORM_ENDPOINT: string = ''

/* ---------- External links ---------- */

export const LINKS: Record<'glt'|'sotmUK'|'sotmNA'|'bookstore'|'leverageWhatsApp'|'leverageTelegram'|'morningDewMixlr'|'morningDewYouTube'|'onlineGiving', string> = {
  glt: '#', // TODO: God's Love Tabernacle (GLT) website URL
  sotmUK: 'https://sotmuk.org',
  sotmNA: 'https://sotmna.org',
  bookstore: 'https://books.segunobadje.org',
  leverageWhatsApp: 'https://bit.ly/WhatsAppLeverageDevotional',
  leverageTelegram: 'https://t.me/LeverageDevotional',
  morningDewMixlr: '', // TODO: Mixlr link for Morning Dew — hidden until filled
  morningDewYouTube: '', // TODO: YouTube link for Morning Dew — hidden until filled
  onlineGiving: '', // TODO: online giving link — the Give page shows a note until filled
}

/* ---------- Socials (icons stay hidden until a URL is pasted in) ---------- */

export const SOCIALS: { name: 'YouTube' | 'Instagram' | 'Facebook' | 'X' | 'Telegram' | 'Spotify'; url: string }[] = [
  { name: 'YouTube', url: '' }, // TODO
  { name: 'Instagram', url: '' }, // TODO
  { name: 'Facebook', url: '' }, // TODO
  { name: 'X', url: '' }, // TODO
  { name: 'Telegram', url: '' }, // TODO
  { name: 'Spotify', url: '' }, // TODO: Bible Truths on Air podcast
]

/* ---------- Giving details ---------- */

export interface BankAccount {
  currency: string
  bank: string
  accountName: string
  accountNumber: string
  extra?: string
}

export const GIVING: BankAccount[] = [
  {
    currency: 'Naira (NGN)',
    bank: 'GTBank',
    accountName: 'SOTM Partnership',
    accountNumber: '0270156587',
  },
  {
    currency: 'Naira (NGN)',
    bank: 'Providus Bank',
    accountName: 'SOTM Partnership',
    accountNumber: '5403470467',
  },
  {
    currency: 'Dollars (USD)',
    bank: 'Bank of America',
    accountName: 'Segun Obadje Teaching Ministries, Inc',
    accountNumber: '488069573637',
  },
  {
    currency: 'Pounds (GBP)',
    bank: 'Lloyds Bank',
    accountName: 'Segun Obadje Teaching Ministries, Ltd.',
    accountNumber: '68647663',
    extra: 'Sort code: 30-99-50 · Reference: SOTM Partnership',
  },
]

export const ZELLE_PAYPAL_EMAIL = 'sotmamerica@gmail.com'

/* ---------- Vision & Mission ---------- */

export const VISION =
  'Taking the entire Gospel of Christ to the ends of the world from coast to coast, revealing the healing and miracle presence and power of Jesus Christ, and making disciples of all nations of the world.'
export const VISION_REF = 'Matthew 28:18–20 · Mark 16:15–20'

export const MISSION = "Manifesting God's Kingdom life, power and glory."
export const MISSION_REF = 'Colossians 1:13–14'

/* ---------- Messages library ----------
   The message library is now LIVE — powered by the SOTM sermon-library API
   (see src/lib/api.ts and the /api folder in this repo). Messages, series,
   ministers and categories are managed in the admin panel (/admin folder)
   and audio files are hosted on OneDrive for direct download. Nothing to
   edit here anymore. */

/* ---------- Books ----------
   coverImage: TODO per book — e.g. '/images/books/zoe.webp'. Until then a
   marked cover placeholder renders. link: defaults to the bookstore. */

export interface Book {
  title: string
  author: string
  blurb: string
  link?: string
  coverImage?: string
}

export const BOOKS: Book[] = [
  {
    title: 'The Power of the Blessing',
    author: 'Apostle Segun Obadje',
    blurb: 'Understanding the empowerment that turns labour into fruitfulness and struggle into rest.',
  },
  {
    title: 'ZOE',
    author: 'Apostle Segun Obadje',
    blurb: 'The God-kind of life — what it is, how you received it, and how to live from it daily.',
  },
  {
    title: 'Realities of the New Man in Christ',
    author: 'Apostle Segun Obadje',
    blurb: 'A scriptural unveiling of who you became in Christ and what now belongs to you.',
  },
  {
    title: 'The Covenant Power of the Blood of Jesus',
    author: 'Apostle Segun Obadje',
    blurb: 'What the blood purchased, sealed and still speaks — and how to plead its full benefit.',
  },
  {
    title: 'Biblical Keys to Protection',
    author: 'Apostle Segun Obadje',
    blurb: 'God’s covenant of safety and how to dwell in the secret place of the Most High.',
  },
  {
    title: 'Biblical Laws of Productivity',
    author: 'Apostle Segun Obadje',
    blurb: 'Kingdom principles that govern increase, fruitfulness and lasting results.',
  },
  {
    title: 'Dominion over the Spirit of Jezebel',
    author: 'Apostle Segun Obadje',
    blurb: 'Recognising and overcoming the seducing, controlling spirit at war with God’s order.',
  },
  {
    title: 'The Hidden Man of the Heart',
    author: 'Apostle Segun Obadje',
    blurb: 'The inner man — the real you — and how to nourish, train and release him.',
  },
  {
    title: 'The Business of Soul Winning',
    author: 'Apostle Segun Obadje',
    blurb: 'The heartbeat of God and the assignment of every believer, made plain and practical.',
  },
  {
    title: 'Pure Milk',
    author: 'Pastor Funke Obadje',
    blurb: 'Foundational nourishment for new believers — growing strong on the sincere milk of the Word.',
  },
  {
    title: 'Pregnancy Companion',
    author: 'Pastor Funke Obadje',
    blurb: 'Faith, scripture and practical wisdom for the journey of expecting God’s gift of a child.',
  },
  {
    title: 'The Leverage Daily Devotional',
    author: 'Apostle Segun Obadje',
    blurb: 'Over 650,000 copies distributed free across Nigeria and the nations. Start your day in the Word.',
  },
]

/* ---------- Free downloads (study notes) ----------
   Add real files to /public/downloads and list them here. Section hides
   automatically while the list is empty of real files. */

export interface Download {
  title: string
  description: string
  fileUrl: string // TODO: e.g. '/downloads/new-creation-study-notes.pdf'
}

export const DOWNLOADS: Download[] = [
  // { title: 'New Creation Realities — Study Notes', description: 'Companion notes for the series.', fileUrl: '/downloads/new-creation-study-notes.pdf' },
]

/* ---------- Events & itinerary ----------
   These are PLACEHOLDER cards, clearly marked on the page. Replace with the
   real itinerary. Dates use ISO format for correct sorting. */

export interface MinistryEvent {
  title: string
  dateLabel: string
  isoDate: string
  city: string
  venue: string
  host: string
  placeholder?: boolean
}

export const EVENTS: MinistryEvent[] = [
  {
    title: 'Sons, Daughters & Partners Conference (SDPC)',
    dateLabel: 'Date to be announced',
    isoDate: '2026-09-01',
    city: 'Lagos, Nigeria',
    venue: 'Venue to be announced',
    host: 'SOTM',
    placeholder: true,
  },
  {
    title: 'Faith Seminar & Healing School',
    dateLabel: 'Date to be announced',
    isoDate: '2026-10-01',
    city: 'City to be announced',
    venue: 'Venue to be announced',
    host: 'Host church',
    placeholder: true,
  },
  {
    title: 'All Ladies Word & Worship Conference (ALWWC)',
    dateLabel: 'Date to be announced',
    isoDate: '2026-11-01',
    city: 'City to be announced',
    venue: 'Venue to be announced',
    host: 'SOTM',
    placeholder: true,
  },
]

/* ---------- Ministry platforms ---------- */

export interface Platform {
  name: string
  category: 'Conferences & Events' | 'Schools & Mentoring' | 'Online Programs' | 'Outreach'
  description: string
  links?: { label: string; url: string }[]
}

export const PLATFORMS: Platform[] = [
  {
    name: 'Sons, Daughters & Partners Conference (SDPC)',
    category: 'Conferences & Events',
    description:
      'The annual family gathering of the ministry — sons, daughters and partners of SOTM from across the nations, sitting under the Word with impartation and fellowship.',
  },
  {
    name: 'Dynamics of the Spirit School of Ministry (DOSSOM)',
    category: 'Conferences & Events',
    description:
      'An intensive gathering on the person, gifts and operations of the Holy Spirit for believers and ministers hungry for the deep things of God.',
  },
  {
    name: 'All Ladies Word & Worship Conference (ALWWC)',
    category: 'Conferences & Events',
    description:
      'A life-transforming gathering of women in the Word and in worship, convened by Pastor Funke Obadje, that has impacted countless women.',
  },
  {
    name: 'Ministers Conference for Campus Leaders (MCCL)',
    category: 'Conferences & Events',
    description:
      'Equipping campus fellowship leaders and student ministers with sound doctrine, leadership and grace for their assignment.',
  },
  {
    name: 'School of Ministry (SOM)',
    category: 'Schools & Mentoring',
    description:
      'A six-week, new-creation-based Bible training institute preparing believers for their God-given assignments. Through the ministry of God’s Word and the impartation of the Holy Spirit, participants gain a clear-cut understanding of ministry and the knowledge required to locate and occupy their rightful place in the Body of Christ — whether called to the five-fold ministry or to excel in their God-ordained field.',
  },
  {
    name: 'School of Global Missions',
    category: 'Schools & Mentoring',
    description:
      'A Spirit-filled training institution equipping men and women for effective ministry and global impact — theology, pneumatology, church planting, prayer, administration, discipleship, leadership and cross-cultural studies — raising kingdom ambassadors who are sound in doctrine, fervent in spirit and ready to disciple nations for Christ.',
  },
  {
    name: 'BASE 314',
    category: 'Schools & Mentoring',
    description: 'A discipleship and grounding platform of the ministry.', // TODO: expand this description
  },
  {
    name: 'Special Mentoring School for Men (SMSM)',
    category: 'Schools & Mentoring',
    description:
      'Born of a mandate Apostle Segun Obadje received from the Lord in 2019 — teaching and grooming men from all walks of life toward maturity, purpose fulfilment and godly leadership, through in-depth teaching, study, prayer and impartation.',
  },
  {
    name: 'Segun & Funke Obadje Mentoring School (SAFOMS)',
    category: 'Schools & Mentoring',
    description:
      'Raising and equipping Kingdom ambassadors through Spirit-led mentorship and practical impartation, with a strong emphasis on clarity of purpose, divine alignment and empowerment.',
  },
  {
    name: 'Mentoring Women for Pastoring',
    category: 'Schools & Mentoring',
    description:
      'Led by Pastor Funke Obadje — mentorship, teaching and impartation for pastors’ wives, female church founders and women called into ministry, establishing them to fulfil their pastoral assignments with grace, boldness and excellence.',
  },
  {
    name: 'REFINED',
    category: 'Schools & Mentoring',
    description:
      'An intensive three-month online mentoring platform for women in ministry, facilitated by Pastor Funke Obadje — teachings, group discussions, seminars and impartations covering ministry, marriage, intercession, parenting and work-life balance.',
  },
  {
    name: 'Online Healing School',
    category: 'Online Programs',
    description:
      'The finished work of Christ concerning healing, expounded — Jesus procured healing for all mankind through His death and resurrection. As the word of healing goes out, the Lord confirms it with signs, wonders and miraculous healings, to the glory of God.',
  },
  {
    name: 'Online Mega Crusade',
    category: 'Online Programs',
    description:
      'A spiritually charged virtual gathering of miracles, healing, signs and wonders — featuring collaborative live ministrations with renowned ministers such as Bishop Francis Wale Oke.',
  },
  {
    name: 'Morning Dew',
    category: 'Online Programs',
    description:
      '“Rain is seasonal, but the dew of the morning is constant.” A daily online prayer altar with Apostle Segun Obadje that has blessed thousands for over six years, with a global family across Europe, North America, Africa, Asia and beyond.',
    links: [
      ...(LINKS.morningDewMixlr ? [{ label: 'Join on Mixlr', url: LINKS.morningDewMixlr }] : []),
      ...(LINKS.morningDewYouTube ? [{ label: 'Watch on YouTube', url: LINKS.morningDewYouTube }] : []),
    ],
  },
  {
    name: '3-Minute Charge with ASO',
    category: 'Online Programs',
    description:
      'Brief devotional audio messages by Apostle Segun Obadje — spiritual teaching and prayer to charge believers daily in faith and the Word.',
  },
  {
    name: 'Sphere of Grace',
    category: 'Online Programs',
    description:
      'A daily video broadcast by Apostle Segun Obadje offering teaching, insight and daily spiritual upliftment, available on the official ministry YouTube channel.',
  },
  {
    name: 'Shout the Word Loud',
    category: 'Online Programs',
    description: 'A confession-of-the-Word platform of the ministry.', // TODO: expand this description
  },
  {
    name: 'Bible Truths on Air (BTOA)',
    category: 'Online Programs',
    description:
      'A podcast by Apostle Segun Obadje on the power of faith, the doctrine of Christ, the anointing of God and the governing principles of the man in Christ — available on Spotify and other platforms.',
  },
  {
    name: 'Apostolic & Prophetic Visits',
    category: 'Outreach',
    description:
      'Apostle Segun and Pastor Funke Obadje minister in churches, conferences and gatherings across Nigeria and the nations. Invite SOTM to your location through the Contact page.',
  },
  {
    name: 'Faith Seminar & Healing School',
    category: 'Outreach',
    description:
      'Teaching meetings where faith is built by the Word and the sick are ministered to, with testimonies of healing following.',
  },
  {
    name: 'Charity Outreaches',
    category: 'Outreach',
    description:
      'Practical demonstrations of God’s love — reaching communities with care, supplies and the good news of Jesus Christ.',
  },
]

/* ---------- Impact figures (About page) ---------- */

export const IMPACT = [
  { figure: '25+', label: 'years of active ministry' },
  { figure: '20+', label: 'churches established across five nations' },
  { figure: '650,000+', label: 'free copies of The Leverage devotional distributed' },
  { figure: '6+', label: 'years of Morning Dew, daily and unbroken' },
]
