interface EyebrowProps {
  children: string
  dark?: boolean
}

/** Section label with the signature blade rule beneath it. */
export default function Eyebrow({ children, dark = false }: EyebrowProps) {
  return (
    <p className={dark ? 'eyebrow-dark' : 'eyebrow'}>
      {children}
      <span className="blade" aria-hidden="true" />
    </p>
  )
}
