import { ArrowUp } from 'lucide-react'
import Link from 'next/link'
import { getTranslations } from 'next-intl/server'

import { FooterLinks } from './FooterLinks'
import { FooterSocialMedia } from './FooterSocialMedia'
import { getLandingFooterLayout, LANDING_FOOTER_SOCIAL_LINKS } from './landingFooter.constants'

export async function LandingFooter({ type, className }: { type?: 'small' | 'default'; className?: string }) {
  const t = await getTranslations('pages.Landing')

  const { paddingY, marginTop, background } = getLandingFooterLayout(type)

  return (
    <footer
      className={`w-full px-4 ${paddingY} text-remark tablet:px-6 md:px-8 lg:px-10 ${marginTop} ${className || ''}`}
      style={background}
    >
      <div className="container-max-width mx-auto flex flex-col items-center gap-default">
        <div className="flex w-full flex-col items-center gap-default md:flex-row md:items-center md:justify-between">
          <FooterSocialMedia links={LANDING_FOOTER_SOCIAL_LINKS} />
          <div className="flex flex-col items-center gap-sm text-center">
            <FooterLinks
              privacyLabel={t('Footer.privacy')}
              termsLabel={t('Footer.terms')}
              cookiesLabel={t('Footer.cookies')}
            />
            <div className="shadow-light text-center text-sm">{t('Footer.copyright')}</div>
          </div>
          <Link
            href="#"
            className="shadow-light inline-flex items-center justify-center gap-xs rounded-full border border-[var(--outline-secondary)] px-6 py-2 text-sm font-semibold uppercase tracking-[0.1em] text-[var(--text-muted)] transition-colors hover:border-[var(--primary)] hover:text-[var(--primary)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--primary)]"
          >
            {t('Footer.backToTop')}
            <ArrowUp className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </footer>
  )
}
