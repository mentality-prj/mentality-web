import { SidebarMenuType } from '../constants/menu'

export const getMenuItemClass = (active: boolean, type: SidebarMenuType) =>
  `flex items-center gap-2 border border-transparent px-4 py-4 font-normal transition-colors ${
    active
      ? `text-primary bg-white border-primary${type === 'admin' ? ' rounded-r-md' : ''}`
      : `hover:bg-white hover:text-textcolor-primary text-secondary${type === 'admin' ? ' rounded-r-md' : ''}`
  }${type === 'admin' ? ' hover:bg-background-alt' : ' hover:bg-background-alt'}`
