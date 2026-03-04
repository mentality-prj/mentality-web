import { SidebarMenuType } from '../constants/menu'

export const getMenuItemClass = (active: boolean, type: SidebarMenuType) => {
  const base = 'flex w-full items-center gap-xs border border-transparent px-4 py-4 font-normal transition-colors'
  const isAdmin = type === 'admin'

  const activePart = isAdmin
    ? 'border-primary text-primary bg-white rounded-r-md'
    : 'border-primary bg-accent-soft text-accent-foreground'

  const inactivePart = isAdmin
    ? 'hover:text-textcolor-primary text-admin-text rounded-r-md hover:bg-background-muted'
    : 'hover:text-textcolor-primary text-textcolor-secondary hover:bg-background-alt'

  return [base, active ? activePart : inactivePart].join(' ')
}
