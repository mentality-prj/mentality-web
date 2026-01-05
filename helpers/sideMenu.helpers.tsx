import { SidebarMenuType } from '../constants/menu'

export const getMenuItemClass = (active: boolean, type: SidebarMenuType) =>
  `flex items-center gap-2 border border-transparent px-4 py-4 font-normal transition-colors ${
    active
      ? `border-primary ${type === 'admin' ? 'text-primary bg-white rounded-r-md' : 'bg-accent-soft hover:bg-accent-soft text-accent-foreground'}`
      : `hover:text-textcolor-primary text-secondary${type === 'admin' ? ' rounded-r-md' : ''}`
  }${type === 'admin' ? ' hover:bg-background-muted' : ' hover:bg-background-alt'}`
