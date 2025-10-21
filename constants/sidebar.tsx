import { useTranslations } from 'next-intl'
import { menu } from './routes'

import { ChartSquareIcon, HomeIcon, NotebookIcon, MedalRibbonIcon, Pulse2Icon, SettingsIcon } from '@/ds/icons/sidebar'

export const SidebarList = () => {
  const t = useTranslations('Sidebar')

  const iconsMap: Record<string, React.ReactNode> = {
    HOME: <HomeIcon />,
    MOODTRACKER: <Pulse2Icon />,
    GUIDE: <NotebookIcon />,
    MYNOTES: <ChartSquareIcon />,
    MYPROGRESS: <MedalRibbonIcon />,
    SETTINGS: <SettingsIcon />,
  }

  const sidebarList = menu.map((item) => ({
    icon: iconsMap[item.key] || <HomeIcon />,
    text: t(item.key),
    link: item.link,
  }))
  console.log('sidebarList', sidebarList)

  return sidebarList
}
