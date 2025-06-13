import { useTranslations } from 'next-intl'

import LoginButton from '@/components/Buttons/LoginButton'

export default function Home() {
  const t = useTranslations('MainPage')
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-3">
      <p className="text-5xl">{t('Coming soon')}</p>
      <LoginButton />
    </div>
  )
}
