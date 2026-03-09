import { getTranslations } from 'next-intl/server'

export default async function TermsOfServicePage() {
  const t = await getTranslations('pages.TermsOfService')

  return (
    <main className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="mb-2 text-4xl font-bold">{t('title')}</h1>
      <p className="mb-8 text-sm text-[var(--text-muted)]">{t('lastUpdated')}</p>

      <section className="mb-8">
        <h2 className="mb-3 text-2xl font-semibold">{t('acceptance.title')}</h2>
        <p className="leading-relaxed text-[var(--text-secondary)]">{t('acceptance.content')}</p>
      </section>

      <section className="mb-8">
        <h2 className="mb-3 text-2xl font-semibold">{t('serviceDescription.title')}</h2>
        <p className="leading-relaxed text-[var(--text-secondary)]">{t('serviceDescription.content')}</p>
      </section>

      <section className="mb-8">
        <h2 className="mb-3 text-2xl font-semibold">{t('aiGeneratedContentDisclaimer.title')}</h2>
        <p className="leading-relaxed text-[var(--text-secondary)]">{t('aiGeneratedContentDisclaimer.content')}</p>
      </section>

      <section className="mb-8">
        <h2 className="mb-3 text-2xl font-semibold">{t('noMedicalAdvice.title')}</h2>
        <p className="leading-relaxed text-[var(--text-secondary)]">{t('noMedicalAdvice.content')}</p>
      </section>

      <section className="mb-8">
        <h2 className="mb-3 text-2xl font-semibold">{t('userResponsibilities.title')}</h2>
        <p className="mb-3 leading-relaxed text-[var(--text-secondary)]">{t('userResponsibilities.content')}</p>
        <ul className="ml-6 list-disc space-y-2">
          <li className="text-[var(--text-secondary)]">{t('userResponsibilities.responsibilities.0')}</li>
          <li className="text-[var(--text-secondary)]">{t('userResponsibilities.responsibilities.1')}</li>
          <li className="text-[var(--text-secondary)]">{t('userResponsibilities.responsibilities.2')}</li>
          <li className="text-[var(--text-secondary)]">{t('userResponsibilities.responsibilities.3')}</li>
          <li className="text-[var(--text-secondary)]">{t('userResponsibilities.responsibilities.4')}</li>
          <li className="text-[var(--text-secondary)]">{t('userResponsibilities.responsibilities.5')}</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="mb-3 text-2xl font-semibold">{t('intellectualProperty.title')}</h2>
        <p className="leading-relaxed text-[var(--text-secondary)]">{t('intellectualProperty.content')}</p>
      </section>

      <section className="mb-8">
        <h2 className="mb-3 text-2xl font-semibold">{t('disclaimer.title')}</h2>
        <p className="leading-relaxed text-[var(--text-secondary)]">{t('disclaimer.content')}</p>
      </section>

      <section className="mb-8">
        <h2 className="mb-3 text-2xl font-semibold">{t('limitation.title')}</h2>
        <p className="leading-relaxed text-[var(--text-secondary)]">{t('limitation.content')}</p>
      </section>

      <section className="mb-8">
        <h2 className="mb-3 text-2xl font-semibold">{t('termination.title')}</h2>
        <p className="leading-relaxed text-[var(--text-secondary)]">{t('termination.content')}</p>
      </section>

      <section className="mb-8">
        <h2 className="mb-3 text-2xl font-semibold">{t('changes.title')}</h2>
        <p className="leading-relaxed text-[var(--text-secondary)]">{t('changes.content')}</p>
      </section>

      <section className="mb-8">
        <h2 className="mb-3 text-2xl font-semibold">{t('contact.title')}</h2>
        <p className="leading-relaxed text-[var(--text-secondary)]">{t('contact.content')}</p>
        <p className="mt-2">
          <a href={`mailto:${t('contact.email')}`} className="text-[var(--primary)] hover:underline">
            {t('contact.email')}
          </a>
        </p>
      </section>
    </main>
  )
}
