import { useTranslations } from 'next-intl'

import { adminMenu } from '@/constants/menu'
import { Link } from '@/i18n/navigation'

const AdminNav = () => {
  const t = useTranslations('components.Navbar')
  return (
    <nav className="hidden items-center gap-8 text-base font-normal leading-[120%] tracking-normal text-[var(--title-color)] md:flex">
      {adminMenu.map((item) => (
        <Link key={item.key} href={item.href} className="hover:underline">
          {t(item.key)}
        </Link>
      ))}
    </nav>
  )
}

export default AdminNav
