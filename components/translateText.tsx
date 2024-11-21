import { useTranslations } from 'next-intl'

import LocalSwitcher from './localSwitcher'

export default function TranslateText() {
  const t = useTranslations('HomePage')

  return (
    <div className="flex flex-col gap-4">
      <LocalSwitcher />
      <div>Translate: {t('testText')}</div>
    </div>
  )
}
