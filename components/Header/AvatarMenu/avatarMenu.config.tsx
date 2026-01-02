import LogOutButton from '@/components/Buttons/LogOutButton'
import { Routes } from '@/constants/routes'

export const getMenuItems = (
  locale: string,
  role: string,
  t: (key: string) => string,
  router: ReturnType<typeof import('next/navigation').useRouter>
) => [
  {
    key: 'profile',
    label: t('profile'),
    onClick: () => router.push(`/${locale}${Routes.PROFILE}`),
    className: 'dropdown-menu-item',
    show: true,
  },
  {
    key: 'settings',
    label: t('settings'),
    onClick: () => router.push(`/${locale}${Routes.SETTINGS}`),
    className: 'dropdown-menu-item',
    show: true,
  },
  {
    key: 'admin',
    label: t('admin'),
    onClick: () => router.push(`/${locale}${Routes.ADMIN}`),
    className: 'dropdown-menu-item',
    show: role === 'admin',
  },
  {
    key: 'logout',
    label: null,
    asChild: true,
    element: <LogOutButton />,
    show: true,
  },
]
