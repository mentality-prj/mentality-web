import { LogIn } from 'lucide-react'
import { useTranslations } from 'next-intl'

import { Routes } from '@/constants/routes'
import { Link } from '@/i18n/navigation'
import { Button } from '@/ui/button'

export function LoginButton({ title }: { title?: string }) {
  const t = useTranslations('components.Navbar')
  return (
    <Button
      asChild
      aria-label={title ? t(title) : t('login')}
      variant="volume"
      className="max-tablet:h-9 max-tablet:w-9 max-tablet:p-0"
    >
      <Link href={Routes.AUTH}>
        <LogIn className="tablet:hidden" size={20} />
        <span className="hidden tablet:block">{title ? t(title) : t('login')}</span>
      </Link>
    </Button>
  )
}
