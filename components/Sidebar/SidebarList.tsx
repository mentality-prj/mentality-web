import { useTranslations } from 'next-intl'

import { rawSidebarUnderLineMenu, rawSidebarUpLineMenu } from '@/constants/sidebar'

export const useSidebarList = () => {
  const t = useTranslations('components.Sidebar')

  const sidebarUpLineMenu = rawSidebarUpLineMenu.map((item) => ({
    ...item,
    text: t(item.key),
  }))

  const sidebarUnderLineMenu = rawSidebarUnderLineMenu.map((item) => ({
    ...item,
    text: t(item.key),
  }))

  return { sidebarUpLineMenu, sidebarUnderLineMenu }
}
