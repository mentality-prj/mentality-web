import type { ReactNode } from 'react'

import LogOutButton from '@/components/shared/Buttons/LogOutButton'
import { Routes } from '@/constants/routes'
import { COMPANY_ROLES } from '@/types/rbac'

type LinkMenuItem = {
  key: 'profile' | 'settings' | 'admin'
  label: string
  href: string
  className: string
  show: boolean
}

type LogoutMenuItem = {
  key: 'logout'
  label: null
  show: boolean
  element: ReactNode
}

export type AvatarMenuItem = LinkMenuItem | LogoutMenuItem

export const getMenuItems = (
  role: string,
  companyRole: string | undefined,
  t: (key: string) => string
): AvatarMenuItem[] => [
  {
    key: 'profile',
    label: t('profile'),
    href: Routes.PROFILE,
    className: 'dropdown-menu-item',
    show: true,
  },
  {
    key: 'settings',
    label: t('settings'),
    href: Routes.SETTINGS,
    className: 'dropdown-menu-item',
    show: role === 'admin' || companyRole === COMPANY_ROLES.MANAGER,
  },
  {
    key: 'admin',
    label: t('admin'),
    href: Routes.ADMIN,
    className: 'dropdown-menu-item',
    show: role === 'admin',
  },
  {
    key: 'logout',
    label: null,
    element: <LogOutButton />,
    show: true,
  },
]
