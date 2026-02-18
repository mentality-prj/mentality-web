import { useTranslations } from 'next-intl'

import { Routes } from '@/constants/routes'
import { Link } from '@/i18n/navigation'
import { Button } from '@/ui/button'

export function LoginButton({ title }: { title?: string }) {
  const t = useTranslations('components.Navbar')
  return (
    <Button asChild variant="volume" size="large">
      <Link href={Routes.SIGNIN}>{title ? t(title) : t('login')}</Link>
    </Button>
  )
}
