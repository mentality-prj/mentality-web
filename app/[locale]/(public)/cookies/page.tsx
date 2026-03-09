import { getTranslations } from 'next-intl/server'

import { Routes } from '@/constants/routes'
import { Link } from '@/i18n/navigation'

export default async function CookiesPolicyPage() {
  const t = await getTranslations('pages.CookiesPolicy')

  return (
    <main className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="mb-2 text-4xl font-bold">{t('title')}</h1>
      <p className="mb-8 text-sm text-[var(--text-muted)]">{t('lastUpdated')}</p>

      <section className="mb-8">
        <h2 className="mb-3 text-2xl font-semibold">{t('introduction.title')}</h2>
        <p className="leading-relaxed text-[var(--text-secondary)]">{t('introduction.content')}</p>
      </section>

      <section className="mb-8">
        <h2 className="mb-3 text-2xl font-semibold">{t('howWeUseCookies.title')}</h2>
        <p className="mb-3 leading-relaxed text-[var(--text-secondary)]">{t('howWeUseCookies.content')}</p>
        <ul className="ml-6 list-disc space-y-2">
          <li className="text-[var(--text-secondary)]">{t('howWeUseCookies.purposes.0')}</li>
          <li className="text-[var(--text-secondary)]">{t('howWeUseCookies.purposes.1')}</li>
          <li className="text-[var(--text-secondary)]">{t('howWeUseCookies.purposes.2')}</li>
          <li className="text-[var(--text-secondary)]">{t('howWeUseCookies.purposes.3')}</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="mb-3 text-2xl font-semibold">{t('typesOfCookies.title')}</h2>

        <div className="mb-4">
          <h3 className="mb-2 text-xl font-semibold">{t('typesOfCookies.essential.title')}</h3>
          <p className="leading-relaxed text-[var(--text-secondary)]">{t('typesOfCookies.essential.content')}</p>
        </div>

        <div className="mb-4">
          <h3 className="mb-2 text-xl font-semibold">{t('typesOfCookies.analytics.title')}</h3>
          <p className="leading-relaxed text-[var(--text-secondary)]">{t('typesOfCookies.analytics.content')}</p>
        </div>

        <div className="mb-4">
          <h3 className="mb-2 text-xl font-semibold">{t('typesOfCookies.functional.title')}</h3>
          <p className="leading-relaxed text-[var(--text-secondary)]">{t('typesOfCookies.functional.content')}</p>
        </div>

        <div className="mb-4">
          <h3 className="mb-2 text-xl font-semibold">{t('typesOfCookies.advertising.title')}</h3>
          <p className="leading-relaxed text-[var(--text-secondary)]">{t('typesOfCookies.advertising.content')}</p>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="mb-3 text-2xl font-semibold">{t('thirdPartyCookies.title')}</h2>
        <p className="leading-relaxed text-[var(--text-secondary)]">{t('thirdPartyCookies.content')}</p>
      </section>

      <section className="mb-8">
        <h2 className="mb-3 text-2xl font-semibold">{t('manageCookies.title')}</h2>
        <p className="mb-3 leading-relaxed text-[var(--text-secondary)]">{t('manageCookies.content')}</p>
        <ul className="ml-6 list-disc space-y-2">
          <li className="text-[var(--text-secondary)]">{t('manageCookies.methods.0')}</li>
          <li className="text-[var(--text-secondary)]">{t('manageCookies.methods.1')}</li>
          <li className="text-[var(--text-secondary)]">{t('manageCookies.methods.2')}</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="mb-3 text-2xl font-semibold">{t('consent.title')}</h2>
        <p className="leading-relaxed text-[var(--text-secondary)]">{t('consent.content')}</p>
      </section>

      <section className="mb-8">
        <h2 className="mb-3 text-2xl font-semibold">{t('changes.title')}</h2>
        <p className="leading-relaxed text-[var(--text-secondary)]">{t('changes.content')}</p>
      </section>

      <section className="mb-8">
        <h2 className="mb-3 text-2xl font-semibold">{t('contact.title')}</h2>
        <p className="leading-relaxed text-[var(--text-secondary)]">{t('contact.content')}</p>
        <p className="mt-2">
          <Link href={Routes.CONTACTS} className="text-[var(--primary)] hover:underline">
            {t('contact.cta')}
          </Link>
        </p>
      </section>
    </main>
  )
}
