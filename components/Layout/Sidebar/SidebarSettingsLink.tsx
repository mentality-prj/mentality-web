import { Settings2 } from 'lucide-react'
import { getLocale, getTranslations } from 'next-intl/server'

import { Routes } from '@/constants/routes'
import { Link } from '@/i18n/navigation'

const SidebarSettingsLink = async () => {
  const locale = await getLocale()
  const t = await getTranslations({ locale, namespace: 'components.AvatarMenu' })

  return (
    <Link
      href={Routes.SETTINGS}
      className="text-remark hover:text-title-light -mr-8 box-border flex items-center justify-center gap-xs overflow-hidden rounded-xl border border-dashed border-border px-8 py-3 transition hover:mr-0 hover:w-full hover:rounded-r-none hover:border-background-alt hover:bg-background-alt hover:pr-16"
    >
      <Settings2 />
      {t('settings')}
    </Link>
  )
}

export default SidebarSettingsLink
