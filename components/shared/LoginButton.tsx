import { LogIn } from 'lucide-react'
import { useTranslations } from 'next-intl'

import { Routes } from '@/constants/routes'
import { Link } from '@/i18n/navigation'

export function LoginButton({ title }: { title?: string }) {
  const t = useTranslations('components.Navbar')
  return (
    <Link
      href={Routes.AUTH}
      aria-label={title ? t(title) : t('login')}
      className="inline-flex min-h-10 min-w-10 items-center justify-center text-base font-normal text-[var(--title-color)] hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 tablet:px-2"
    >
      <LogIn className="tablet:hidden" size={20} />
      <span className="hidden tablet:block">{title ? t(title) : t('login')}</span>
    </Link>
  )
}
