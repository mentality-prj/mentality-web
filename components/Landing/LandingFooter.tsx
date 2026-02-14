import { ArrowUp, Linkedin } from 'lucide-react'
import Link from 'next/link'
import { getTranslations } from 'next-intl/server'

export async function LandingFooter({ type, className }: { type?: 'small' | 'default'; className?: string }) {
  const t = await getTranslations('pages.Landing')

  const socialLinks = [
    {
      name: 'LinkedIn',
      href: 'https://www.linkedin.com/company/dzvin-co/',
      icon: <Linkedin className="icon" size={24} />,
    },
  ] as const

  const gradientStyle = {
    backgroundImage:
      'linear-gradient(135deg, rgba(106, 94, 255, 0.2) 0%, rgba(106, 94, 255, 0.2) 24%, transparent 24%), linear-gradient(215deg, rgba(31, 210, 192, 0.2) 10%, rgba(31, 210, 192, 0.2) 36%, transparent 36%), linear-gradient(335deg, rgba(255, 103, 128, 0.2) 18%, rgba(255, 103, 128, 0.2) 44%, transparent 44%), linear-gradient(25deg, rgba(255, 111, 216, 0.2) 28%, rgba(255, 111, 216, 0.2) 56%, transparent 56%), linear-gradient(295deg, rgba(126, 255, 150, 0.2) 20%, rgba(126, 255, 150, 0.2) 42%, transparent 42%), linear-gradient(55deg, rgba(94, 216, 255, 0.2) 26%, rgba(94, 216, 255, 0.2) 54%, transparent 54%), linear-gradient(275deg, rgba(255, 166, 249, 0.2) 34%, rgba(255, 166, 249, 0.2) 58%, transparent 58%)',
    backgroundSize: '160% 160%',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'calc(50% - 10px) 50%',
  }

  // Calculate vertical padding based on type
  const paddingY = type === 'small' ? 'py-5' : 'py-10'
  const marginTop = type === 'small' ? 'mt-0' : 'mt-16'
  const background = type === 'small' ? {} : gradientStyle

  return (
    <footer
      className={`w-full px-4 ${paddingY} text-remark tablet:px-6 md:px-8 lg:px-10 ${marginTop} ${className || ''}`}
      style={background}
    >
      <div className="container-max-width mx-auto flex flex-col items-center gap-default md:flex-row md:items-center md:justify-between">
        <nav aria-label="Social media">
          <ul className="flex items-center gap-1">
            {socialLinks.map(({ name, href, icon: Icon }) => (
              <li key={name}>
                <a
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={name}
                  className="flex h-11 w-11 items-center justify-center transition-colors hover:text-[var(--primary)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--primary)]"
                >
                  {Icon}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="light-shadow text-center text-sm">{t('Footer.copyright')}</div>
        <Link
          href="#"
          className="light-shadow inline-flex items-center justify-center gap-2 rounded-full border border-[var(--outline-secondary)] px-6 py-2 text-sm font-semibold uppercase tracking-[0.1em] text-[var(--text-muted)] transition-colors hover:border-[var(--primary)] hover:text-[var(--primary)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--primary)]"
        >
          {t('Footer.backToTop')}
          <ArrowUp className="h-4 w-4" />
        </Link>
      </div>
    </footer>
  )
}
