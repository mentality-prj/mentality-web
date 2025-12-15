import { useTranslations } from 'next-intl'

import LoginButton from '@/components/Buttons/LoginButton'

export default function Home() {
  const t = useTranslations('common.title')
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center gap-3">
      <p className="text-5xl">{t('MainPage')}</p>
      <p>dev branch</p>
      <LoginButton />
    </div>
  )
}
