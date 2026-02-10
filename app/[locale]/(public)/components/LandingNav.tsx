import { useTranslations } from 'next-intl'

import { landingMenu } from '@/constants/menu'
import { Link } from '@/i18n/navigation'

export function LandingNav() {
  const t = useTranslations('components.Navbar')
  return (
    <nav className="hidden items-center gap-md text-base font-normal leading-[120%] tracking-normal text-[var(--title-color)] md:flex">
      {landingMenu.map((item) => (
        <Link key={item.key} href={item.href} className="hover:underline">
          {t(item.key)}
        </Link>
      ))}
    </nav>
  )
}
