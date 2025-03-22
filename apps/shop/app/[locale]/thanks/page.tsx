import Link from 'next/link'
import { useTranslations } from 'next-intl'

import { Routes } from '@/constants/routes'

export default function ThanksPage() {
  const t = useTranslations()
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="mb-4 text-center text-3xl">{t('ShopPage.Checkout.Thanks')}</div>
      <Link className="w-[120px] rounded-lg border-1 text-center" href={Routes.MAIN}>
        {t('Navigation.BackToHome')}
      </Link>
    </div>
  )
}
