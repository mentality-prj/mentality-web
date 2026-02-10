import { getLocale, getTranslations } from 'next-intl/server'

import { auth } from '@/auth'
import Card from '@/components/Cards/Card'
import { OtherMeditations } from '@/components/Meditations/OtherMeditations'
import { StyledDescription } from '@/components/Meditations/StyledDescription'
import { Breadcrumbs } from '@/ds/components/Breadcrumbs'
import { PageTitle } from '@/ds/components/PageTitle'
import { Link } from '@/i18n/navigation'
import { getExerciseById } from '@/requests/exercises'
import { SupportedLanguage } from '@/types/languages'

export default async function MeditationPage({ params }: { params: { id: string } }) {
  const t = await getTranslations()
  const session = await auth()
  const locale = (await getLocale()) as SupportedLanguage

  const res = await getExerciseById(session, params.id)

  if (!res.data)
    return (
      <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <div className="flex flex-col items-center gap-4">
          <p className="mt-1 text-2xl text-gray-500">{t('pages.Meditation.notExist')}</p>
          <Link href="/guide/meditations">{t('pages.Meditation.backToMeditations')}</Link>
        </div>
      </div>
    )
  const meditation = res.data
  return (
    <article>
      <Breadcrumbs
        currentPage={meditation.translations.title[`${locale}`]}
        breadcrumbList={[
          { title: t('pages.Guide.title'), href: '/guide' },
          { title: t('common.Breadcrumbs.breadcrumbsList', { title: 'meditation' }), href: '/guide/meditations' },
        ]}
      />
      <PageTitle
        className="py-8"
        title={meditation.translations.title[`${locale}`]}
        subtitle={meditation.translations.annotation[`${locale}`]}
      />
      <div className="flex flex-col gap-6">
        <div className="flex w-full flex-col gap-6 lg:flex-row lg:gap-8">
          <Card title={t('pages.Meditation.descriptionTitle')}>
            <StyledDescription text={meditation.translations.description[`${locale}`]} />
          </Card>
          {/* TODO: Add card  */}
        </div>
        <OtherMeditations currentMeditationId={params.id} />
      </div>
    </article>
  )
}
