import { underLineMenu, upLineMenu } from '@/constants/routes'
import { ChartSquareIcon, HomeIcon, MedalRibbonIcon, NotebookIcon, Pulse2Icon, SettingsIcon } from '@/ds/icons/sidebar'

export const iconsUpLineMenu: Record<string, React.ReactNode> = {
  HOME: <HomeIcon />,
  MOODTRACKER: <Pulse2Icon />,
  GUIDE: <NotebookIcon />,
  MYNOTES: <ChartSquareIcon />,
  MYPROGRESS: <MedalRibbonIcon />,
} as const

export const iconsUnderLineMenu: Record<string, React.ReactNode> = {
  SETTINGS: <SettingsIcon />,
} as const

export const rawSidebarUpLineMenu = upLineMenu.map((item) => ({
  icon: iconsUpLineMenu[item.key] || <HomeIcon />,
  key: item.key,
  link: item.link,
}))

export const rawSidebarUnderLineMenu = underLineMenu.map((item) => ({
  icon: iconsUnderLineMenu[item.key] || <HomeIcon />,
  key: item.key,
  link: item.link,
}))
