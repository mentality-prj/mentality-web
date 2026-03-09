import { Mail } from 'lucide-react'
import { getTranslations } from 'next-intl/server'

import { Routes } from '@/constants/routes'
import { Link } from '@/i18n/navigation'

export default async function PrivacyPolicyPage() {
  const t = await getTranslations('pages.PrivacyPolicy')

  return (
    <main className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="mb-2 text-4xl font-bold">{t('title')}</h1>
      <p className="mb-8 text-sm text-[var(--text-muted)]">{t('lastUpdated')}</p>

      <section className="mb-8">
        <p className="leading-relaxed text-[var(--text-secondary)]">{t('introduction')}</p>
      </section>

      <section className="mb-8">
        <h2 className="mb-3 text-2xl font-semibold">{t('informationWeCollect.title')}</h2>
        <p className="mb-3 leading-relaxed text-[var(--text-secondary)]">{t('informationWeCollect.content')}</p>

        <h3 className="mb-2 mt-4 text-xl font-semibold">{t('informationWeCollect.accountInfo.title')}</h3>
        <p className="mb-2 leading-relaxed text-[var(--text-secondary)]">
          {t('informationWeCollect.accountInfo.content')}
        </p>
        <ul className="ml-6 list-disc space-y-1">
          <li className="text-[var(--text-secondary)]">{t('informationWeCollect.accountInfo.items.0')}</li>
          <li className="text-[var(--text-secondary)]">{t('informationWeCollect.accountInfo.items.1')}</li>
          <li className="text-[var(--text-secondary)]">{t('informationWeCollect.accountInfo.items.2')}</li>
          <li className="text-[var(--text-secondary)]">{t('informationWeCollect.accountInfo.items.3')}</li>
        </ul>

        <h3 className="mb-2 mt-4 text-xl font-semibold">{t('informationWeCollect.usageData.title')}</h3>
        <p className="mb-2 leading-relaxed text-[var(--text-secondary)]">
          {t('informationWeCollect.usageData.content')}
        </p>
        <ul className="ml-6 list-disc space-y-1">
          <li className="text-[var(--text-secondary)]">{t('informationWeCollect.usageData.items.0')}</li>
          <li className="text-[var(--text-secondary)]">{t('informationWeCollect.usageData.items.1')}</li>
          <li className="text-[var(--text-secondary)]">{t('informationWeCollect.usageData.items.2')}</li>
          <li className="text-[var(--text-secondary)]">{t('informationWeCollect.usageData.items.3')}</li>
          <li className="text-[var(--text-secondary)]">{t('informationWeCollect.usageData.items.4')}</li>
          <li className="text-[var(--text-secondary)]">{t('informationWeCollect.usageData.items.5')}</li>
        </ul>

        <h3 className="mb-2 mt-4 text-xl font-semibold">{t('informationWeCollect.cookies.title')}</h3>
        <p className="mb-2 leading-relaxed text-[var(--text-secondary)]">{t('informationWeCollect.cookies.content')}</p>
        <ul className="ml-6 list-disc space-y-1">
          <li className="text-[var(--text-secondary)]">{t('informationWeCollect.cookies.purposes.0')}</li>
          <li className="text-[var(--text-secondary)]">{t('informationWeCollect.cookies.purposes.1')}</li>
          <li className="text-[var(--text-secondary)]">{t('informationWeCollect.cookies.purposes.2')}</li>
        </ul>
        <p className="mt-2 text-[var(--text-secondary)]">{t('informationWeCollect.cookies.disableNote')}</p>
      </section>

      <section className="mb-8">
        <h2 className="mb-3 text-2xl font-semibold">{t('howWeUseData.title')}</h2>
        <p className="mb-3 leading-relaxed text-[var(--text-secondary)]">{t('howWeUseData.content')}</p>
        <ul className="ml-6 list-disc space-y-2">
          <li className="text-[var(--text-secondary)]">{t('howWeUseData.purposes.0')}</li>
          <li className="text-[var(--text-secondary)]">{t('howWeUseData.purposes.1')}</li>
          <li className="text-[var(--text-secondary)]">{t('howWeUseData.purposes.2')}</li>
          <li className="text-[var(--text-secondary)]">{t('howWeUseData.purposes.3')}</li>
          <li className="text-[var(--text-secondary)]">{t('howWeUseData.purposes.4')}</li>
          <li className="text-[var(--text-secondary)]">{t('howWeUseData.purposes.5')}</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="mb-3 text-2xl font-semibold">{t('legalBasis.title')}</h2>
        <p className="mb-3 leading-relaxed text-[var(--text-secondary)]">{t('legalBasis.content')}</p>
        <ul className="ml-6 list-disc space-y-2">
          <li className="text-[var(--text-secondary)]">
            <strong>{t('legalBasis.bases.0.name')}</strong> — {t('legalBasis.bases.0.description')}
          </li>
          <li className="text-[var(--text-secondary)]">
            <strong>{t('legalBasis.bases.1.name')}</strong> — {t('legalBasis.bases.1.description')}
          </li>
          <li className="text-[var(--text-secondary)]">
            <strong>{t('legalBasis.bases.2.name')}</strong> — {t('legalBasis.bases.2.description')}
          </li>
          <li className="text-[var(--text-secondary)]">
            <strong>{t('legalBasis.bases.3.name')}</strong> — {t('legalBasis.bases.3.description')}
          </li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="mb-3 text-2xl font-semibold">{t('dataSecurity.title')}</h2>
        <p className="mb-3 leading-relaxed text-[var(--text-secondary)]">{t('dataSecurity.content')}</p>
        <p className="leading-relaxed text-[var(--text-secondary)]">{t('dataSecurity.disclaimer')}</p>
      </section>

      <section className="mb-8">
        <h2 className="mb-3 text-2xl font-semibold">{t('thirdPartyServices.title')}</h2>
        <p className="mb-3 leading-relaxed text-[var(--text-secondary)]">{t('thirdPartyServices.content')}</p>
        <ul className="ml-6 list-disc space-y-2">
          <li className="text-[var(--text-secondary)]">
            <strong>{t('thirdPartyServices.services.0.name')}</strong> –{' '}
            {t('thirdPartyServices.services.0.description')}
          </li>
          <li className="text-[var(--text-secondary)]">
            <strong>{t('thirdPartyServices.services.1.name')}</strong> –{' '}
            {t('thirdPartyServices.services.1.description')}
          </li>
          <li className="text-[var(--text-secondary)]">
            <strong>{t('thirdPartyServices.services.2.name')}</strong> –{' '}
            {t('thirdPartyServices.services.2.description')}
          </li>
          <li className="text-[var(--text-secondary)]">
            <strong>{t('thirdPartyServices.services.3.name')}</strong> –{' '}
            {t('thirdPartyServices.services.3.description')}
          </li>
          <li className="text-[var(--text-secondary)]">
            <strong>{t('thirdPartyServices.services.4.name')}</strong> –{' '}
            {t('thirdPartyServices.services.4.description')}
          </li>
        </ul>
        <p className="mt-3 text-[var(--text-secondary)]">{t('thirdPartyServices.cookieNote')}</p>
        <p className="mt-2 text-[var(--text-secondary)]">{t('thirdPartyServices.compliance')}</p>
      </section>

      <section className="mb-8">
        <h2 className="mb-3 text-2xl font-semibold">{t('dataRetention.title')}</h2>
        <p className="mb-3 leading-relaxed text-[var(--text-secondary)]">{t('dataRetention.content')}</p>
        <ul className="ml-6 list-disc space-y-1">
          <li className="text-[var(--text-secondary)]">{t('dataRetention.reasons.0')}</li>
          <li className="text-[var(--text-secondary)]">{t('dataRetention.reasons.1')}</li>
          <li className="text-[var(--text-secondary)]">{t('dataRetention.reasons.2')}</li>
          <li className="text-[var(--text-secondary)]">{t('dataRetention.reasons.3')}</li>
        </ul>
        <p className="mt-2 text-[var(--text-secondary)]">{t('dataRetention.deletionNote')}</p>
      </section>

      <section className="mb-8">
        <h2 className="mb-3 text-2xl font-semibold">{t('yourRights.title')}</h2>
        <p className="mb-3 leading-relaxed text-[var(--text-secondary)]">{t('yourRights.content')}</p>
        <ul className="ml-6 list-disc space-y-2">
          <li className="text-[var(--text-secondary)]">{t('yourRights.rights.0')}</li>
          <li className="text-[var(--text-secondary)]">{t('yourRights.rights.1')}</li>
          <li className="text-[var(--text-secondary)]">{t('yourRights.rights.2')}</li>
          <li className="text-[var(--text-secondary)]">{t('yourRights.rights.3')}</li>
          <li className="text-[var(--text-secondary)]">{t('yourRights.rights.4')}</li>
          <li className="text-[var(--text-secondary)]">{t('yourRights.rights.5')}</li>
        </ul>
        <p className="mt-2 text-[var(--text-secondary)]">{t('yourRights.exerciseNote')}</p>
      </section>

      <section className="mb-8">
        <h2 className="mb-3 text-2xl font-semibold">{t('childrenPrivacy.title')}</h2>
        <p className="mb-3 leading-relaxed text-[var(--text-secondary)]">{t('childrenPrivacy.content')}</p>
        <p className="leading-relaxed text-[var(--text-secondary)]">{t('childrenPrivacy.disclaimer')}</p>
      </section>

      <section className="mb-8">
        <h2 className="mb-3 text-2xl font-semibold">{t('changes.title')}</h2>
        <p className="mb-3 leading-relaxed text-[var(--text-secondary)]">{t('changes.content')}</p>
        <p className="leading-relaxed text-[var(--text-secondary)]">{t('changes.updateNote')}</p>
      </section>

      <section className="mb-8">
        <h2 className="mb-3 text-2xl font-semibold">{t('contact.title')}</h2>
        <p className="leading-relaxed text-[var(--text-secondary)]">{t('contact.content')}</p>
        <p className="mt-2">
          <Link href={Routes.CONTACTS} className="inline-flex items-center gap-2 text-[var(--primary)] hover:underline">
            <Mail className="h-4 w-4" />
            {t('contact.cta')}
          </Link>
        </p>
      </section>
    </main>
  )
}
