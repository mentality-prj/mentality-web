import { useTranslations } from 'next-intl'

import { Button } from '@/ds/shadcn/button'
import { Link } from '@/i18n/navigation'

export function LoginButton({ title }: { title?: string }) {
  const t = useTranslations('components.Navbar')
  return (
    <Button asChild variant="volume" size="large">
      <Link href="/signin">{title ? t(title) : t('login')}</Link>
    </Button>
  )
}
