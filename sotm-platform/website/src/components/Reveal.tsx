import { useEffect, useRef, type ReactNode } from 'react'

interface RevealProps {
  children: ReactNode
  className?: string
  /** Stagger step: 0 (default), 1, 2 or 3 */
  delay?: 0 | 1 | 2 | 3
  as?: 'div' | 'section' | 'article' | 'li' | 'header' | 'figure'
}

/** Fades/slides children in once when scrolled into view.
    Reduced-motion users see content immediately (handled in CSS). */
export default function Reveal({ children, className = '', delay = 0, as: Tag = 'div' }: RevealProps) {
  const ref = useRef<HTMLElement | null>(null)

  useEffect(() => {
    const node = ref.current
    if (!node) return
    if (!('IntersectionObserver' in window)) {
      node.classList.add('is-visible')
      return
    }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  const delayClass = delay ? ` reveal-delay-${delay}` : ''

  return (
    <Tag ref={ref as never} className={`reveal${delayClass} ${className}`.trim()}>
      {children}
    </Tag>
  )
}
