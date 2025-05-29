import { useTranslations } from 'next-intl'

import { BagIcon } from '@/ds/icons/bag'
import { BellIcon } from '@/ds/icons/bell'
import { ChartSquareIcon } from '@/ds/icons/chart-square'
import { HomeIcon } from '@/ds/icons/home'
import { InfoSquareIcon } from '@/ds/icons/info-square'
import { MedalRibbonIcon } from '@/ds/icons/medal-ribbon'
import { NotesMinimalisticIcon } from '@/ds/icons/notes-minimalistic'
import { Pulse2Icon } from '@/ds/icons/pulse2'
import { SettingsIcon } from '@/ds/icons/settings'
import { UserIcon } from '@/ds/icons/user'

export const SidebarList = () => {
  const t = useTranslations('Sidebar')
  const sidebarList = [
    [
      { icon: <HomeIcon />, text: t('Home'), link: '/' },
      { icon: <Pulse2Icon />, text: t('Mood tracker'), link: '/mood-tracker' },
      { icon: <NotesMinimalisticIcon />, text: t('AI-assistant'), link: '/ai-assistant' },
      { icon: <ChartSquareIcon />, text: t('My notes'), link: '/my-notes' },
      { icon: <MedalRibbonIcon />, text: t('My progress'), link: '/my-progress' },
      { icon: <BellIcon />, text: t('Reminder'), link: '/reminder' },
      { icon: <BagIcon />, text: t('Shop'), link: '/shop' },
    ],
    [
      { icon: <SettingsIcon />, text: t('Settings'), link: '/settings' },
      { icon: <UserIcon />, text: t('Profile'), link: '/profile' },
      { icon: <InfoSquareIcon />, text: t('Support'), link: '/support' },
    ],
  ]

  return sidebarList
}
