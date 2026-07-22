import { Link } from 'react-router-dom'
import Seo from '../components/Seo'

export default function NotFound() {
  return (
    <>
      <Seo title="Page not found" description="The page you were looking for does not exist." />
      <section className="bg-parchment">
        <div className="container-site flex min-h-[60vh] flex-col items-start justify-center py-20">
          <p className="eyebrow">
            404
            <span className="blade" aria-hidden="true" />
          </p>
          <h1 className="mt-4 text-4xl font-extrabold sm:text-5xl">This page is not here.</h1>
          <p className="mt-4 max-w-xl text-lg text-ink/80">
            The link may have changed. Head back home or browse the message library.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link to="/" className="btn-ink">
              Go home
            </Link>
            <Link to="/messages" className="btn-outline">
              Browse messages
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
