import { getLocale, getTranslations } from 'next-intl/server'

import { auth } from '@/auth'
import { OtherMeditations } from '@/components/features/Meditations/OtherMeditations'
import { StyledDescription } from '@/components/features/Meditations/StyledDescription'
import Card from '@/components/shared/Cards/Card'
import { PageTitle } from '@/ds/components/PageTitle'
import { Link } from '@/i18n/navigation'
import { getExerciseById } from '@/requests/exercises'
import { SupportedLanguage } from '@/types/languages'

export default async function MeditationPage({ params }: { params: Promise<{ id: string }> }) {
  const tpm = await getTranslations('pages.Meditation')
  const session = await auth()
  const locale = (await getLocale()) as SupportedLanguage
  const { id } = await params

  const res = await getExerciseById(session, id)

  if (res.error) {
    return (
      <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <div className="flex flex-col items-center gap-4">
          <p className="mt-1 text-2xl text-gray-500">{tpm('somethingWentWrong')}</p>
          <Link href="/guide/meditations">{tpm('backToMeditations')}</Link>
        </div>
      </div>
    )
  }

  if (!res.data || res.data.category !== 'meditation') {
    return (
      <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <div className="flex flex-col items-center gap-4">
          <p className="mt-1 text-2xl text-gray-500">{tpm('notExist')}</p>
          <Link href="/guide/meditations">{tpm('backToMeditations')}</Link>
        </div>
      </div>
    )
  }
  const meditation = res.data
  return (
    <article>
      {/* <Breadcrumbs
        currentPage={meditation.translations.title[`${locale}`]}
        breadcrumbList={[
          { title: t('pages.Guide.title'), href: '/guide' },
          { title: t('common.Breadcrumbs.breadcrumbsList', { title: 'meditation' }), href: '/guide/meditations' },
        ]}
      /> */}
      <PageTitle
        className="py-8"
        title={meditation.translations.title[`${locale}`]}
        subtitle={meditation.translations.annotation[`${locale}`]}
      />
      <div className="flex flex-col gap-sm">
        <div className="flex w-full flex-col gap-sm lg:flex-row lg:gap-8">
          <Card title={tpm('descriptionTitle')}>
            <StyledDescription text={meditation.translations.description[`${locale}`]} />
          </Card>
          {/* TODO: Add card  */}
        </div>
        <OtherMeditations currentMeditationId={id} />
      </div>
    </article>
  )
}
