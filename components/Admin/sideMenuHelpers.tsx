import { Brain, Lightbulb, Tag } from 'lucide-react'

import { AdminMenuType } from '@/constants/admin'

export const getMenuIcon = (item: AdminMenuType) => {
  switch (item) {
    case 'TAGS':
      return <Tag size={18} className="mr-2" />
    case 'TIPS':
      return <Lightbulb size={18} className="mr-2" />
    case 'EXERCISES':
      return <Brain size={18} className="mr-2" />
    default:
      return null
  }
}

export const getMenuItemClass = (active: boolean) =>
  `block border border-transparent px-4 py-2 text-base font-medium transition-colors ${
    active
      ? 'text-primary bg-white border-primary'
      : 'hover:bg-secondary-hover hover:text-textcolor-primary text-textcolor-primary'
  }`
