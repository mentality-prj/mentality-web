import Image from 'next/image'
import { useTranslations } from 'next-intl'

import LangSwitch from '@/components/Header/LangSwitch'
import { Button } from '@/ds/shadcn/button'
import { Link } from '@/i18n/navigation'

export function LandingHeader() {
  const t = useTranslations('components.Navbar')

  return (
    <header className="w-full bg-transparent py-4">
      <div className="mx-auto flex max-w-[1440px] items-center justify-between px-4 tablet:px-6 md:px-8 lg:px-10">
        <div
          data-landing-logo
          className="color-[var(--title-color)] flex items-center text-2xl font-bold uppercase leading-none text-[var(--primary)]"
        >
          <span>Dzvin</span>
          <Image src="/logo.png" alt="Dzvin.co" width={40} height={40} priority={false} className="h-10 w-10" />
          <span>co</span>
        </div>
        <nav className="hidden items-center gap-8 text-base font-normal leading-[120%] tracking-normal text-[var(--title-color)] md:flex">
          <Link href="/" className="hover:underline">
            {t('home')}
          </Link>
          <Link href="/about" className="hover:underline">
            {t('about')}
          </Link>
          <Link href="/services" className="hover:underline">
            {t('services')}
          </Link>
          <Link href="/faq" className="hover:underline">
            {t('faq')}
          </Link>
          <Link href="/contacts" className="hover:underline">
            {t('contact')}
          </Link>
        </nav>
        <div className="flex shrink-0 items-center gap-3">
          <div className="mr-2">
            <LangSwitch />
          </div>
          <Button asChild variant="volume">
            <Link href="/signin">{t('login')}</Link>
          </Button>
        </div>
      </div>
    </header>
  )
}
