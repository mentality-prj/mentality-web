import { useTranslations } from 'next-intl'

import { Routes } from '@/constants/routes'
import { Link } from '@/i18n/navigation'

export default function CartEmpty() {
  const t = useTranslations()
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="mb-4 text-center text-3xl">{t('CartPage.CartEmpty')}</div>
      <Link className="border-1 w-[120px] rounded-lg text-center" href={Routes.SHOP}>
        {t('Navigation.BackToShop')}
      </Link>
    </div>
  )
}
