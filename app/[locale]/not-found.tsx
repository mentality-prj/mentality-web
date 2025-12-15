import { useTranslations } from 'next-intl'

import { Routes } from '@/constants/routes'
import { Button } from '@/ds/shadcn/button'
import { Link } from '@/i18n/navigation'

export default function NotFoundPage() {
  const t = useTranslations()
  return (
    <div className="mx-auto flex flex-col items-center justify-center">
      <div className="mb-4 text-center text-3xl">{t('common.title.NotFoundPage')}</div>
      <Button variant="linkButton" asChild>
        <Link className="border-1 rounded-lg text-center" href={Routes.MAIN}>
          {t('components.Navigation.BackToHome')}
        </Link>
      </Button>
    </div>
  )
}
