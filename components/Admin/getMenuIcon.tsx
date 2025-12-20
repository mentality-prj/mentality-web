import { Brain, Lightbulb, Tag } from 'lucide-react'

import { adminMenu, AdminMenuType } from '@/constants/admin'

const iconsMap = {
  TAGS: <Tag size={18} className="mr-2" />,
  TIPS: <Lightbulb size={18} className="mr-2" />,
  EXERCISES: <Brain size={18} className="mr-2" />,
}

export const getMenuIcon = (item: (typeof adminMenu)[number]) => iconsMap[item as AdminMenuType] ?? null
