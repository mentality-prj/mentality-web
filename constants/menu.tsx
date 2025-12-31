export type TopMenuItem = {
  key: string
  href: string
  icon?: string
}

export type LandingMenuType = TopMenuItem[]
export type AdminTopMenuType = TopMenuItem[]
export type UserTopMenuType = TopMenuItem[]
export type TopMenuType = LandingMenuType | AdminTopMenuType | UserTopMenuType

export const landingMenu: LandingMenuType = [
  { key: 'about', href: '/about' },
  { key: 'services', href: '/services' },
  { key: 'faq', href: '/faq' },
  { key: 'contacts', href: '/contacts' },
  { key: 'myday', href: '/myday', icon: 'bookHeart' },
]

export const adminTopMenu: AdminTopMenuType = [
  { key: 'myday', href: '/myday', icon: 'bookHeart' },
  { key: 'admin', href: '/admin', icon: 'layoutDashboard' },
]

export const userTopMenu: UserTopMenuType = [
  { key: 'myday', href: '/myday', icon: 'bookHeart' },
  { key: 'faq', href: '/faq' },
  { key: 'contacts', href: '/contacts' },
]
