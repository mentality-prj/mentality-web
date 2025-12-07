'use client'

import { useTranslations } from 'next-intl'

import { Routes } from '@/constants/routes'
import { Button } from '@/ds/shadcn/button'
import { Link } from '@/i18n/navigation'

export default function ServerErrorPage() {
  const t = useTranslations('ServerError')

  return (
    <div className="mx-auto flex min-h-screen flex-col items-center justify-center gap-6 px-4">
      <div className="flex flex-col items-center gap-4 text-center">
        <h1 className="text-4xl font-bold">{t('title')}</h1>
        <p className="text-muted-foreground max-w-md text-lg">{t('description')}</p>
      </div>

      <div className="flex flex-col items-start gap-3 text-center">
        <p className="text-muted-foreground text-sm font-semibold">{t('suggestions')}</p>
        <ul className="text-muted-foreground space-y-2 text-left text-sm">
          <li>• {t('suggestion1')}</li>
          <li>• {t('suggestion2')}</li>
          <li>• {t('suggestion3')}</li>
        </ul>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <Button asChild>
          <Link href={Routes.SIGNIN}>{t('backToSignin')}</Link>
        </Button>
        <Button variant="secondary" onClick={() => window.location.reload()}>
          {t('tryAgain')}
        </Button>
      </div>
    </div>
  )
}
