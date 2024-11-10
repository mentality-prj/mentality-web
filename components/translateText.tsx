import { useTranslations } from 'next-intl'

export default function TranslateText() {
  const t = useTranslations('HomePage')

  return <p>{t('title')}</p>
}
