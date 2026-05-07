import type { LucideIcon } from 'lucide-react'

export type FAQSectionId = 'b2c' | 'b2b' | 'rd'

export type FAQAnswerParagraph = string | { text: string; linkText: string; href: string; linkSuffix?: string }

export type FAQItem = {
  question: string
  answer: FAQAnswerParagraph[]
}

export type FAQSection = {
  id: FAQSectionId
  label: string
  title: string
  description: string
  items: FAQItem[]
}

export type FAQMessages = {
  sections: FAQSection[]
}

export type FAQPageMessages = {
  pages: {
    FAQ: FAQMessages
  }
}

export type OpenQuestionIndexes = Record<FAQSectionId, number | null>

export type FAQSectionAppearance = {
  icon: LucideIcon
  badgeClassName: string
  surfaceClassName: string
  mutedSurfaceClassName: string
  summaryClassName: string
}
