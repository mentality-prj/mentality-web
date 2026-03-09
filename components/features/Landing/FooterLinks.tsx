import { Routes } from '@/constants/routes'
import { Link } from '@/i18n/navigation'

type FooterLinksProps = {
  privacyLabel: string
  termsLabel: string
  cookiesLabel: string
}

const FOOTER_LINK_CLASSNAME =
  'text-[var(--text-muted)] transition-colors hover:text-[var(--primary)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--primary)]'

export function FooterLinks({ privacyLabel, termsLabel, cookiesLabel }: FooterLinksProps) {
  const links = [
    { href: Routes.PRIVACY, label: privacyLabel },
    { href: Routes.TERMS, label: termsLabel },
    { href: Routes.COOKIES, label: cookiesLabel },
  ] as const

  return (
    <nav aria-label="Footer links" className="shadow-light">
      <ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm">
        {links.map(({ href, label }) => (
          <li key={href}>
            <Link href={href} className={FOOTER_LINK_CLASSNAME}>
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}
