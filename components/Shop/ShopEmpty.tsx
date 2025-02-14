import { useTranslations } from 'next-intl'

export default function ShopEmpty() {
  const t = useTranslations()
  return <div>{t('ShopPage.ShopEmpty')}</div>
}
