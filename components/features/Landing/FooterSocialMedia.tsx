import { ReactNode } from 'react'

type SocialLink = {
  name: string
  href: string
  icon: ReactNode
}

type FooterSocialMediaProps = {
  links: readonly SocialLink[]
}

export function FooterSocialMedia({ links }: FooterSocialMediaProps) {
  return (
    <nav aria-label="Social media">
      <ul className="flex items-center gap-1">
        {links.map(({ name, href, icon }) => (
          <li key={name}>
            <a
              href={href}
              target="_blank"
              rel="noreferrer"
              aria-label={name}
              className="flex h-11 w-11 items-center justify-center transition-colors hover:text-[var(--primary)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--primary)]"
            >
              {icon}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}
