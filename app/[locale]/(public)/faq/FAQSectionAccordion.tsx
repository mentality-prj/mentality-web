import { ChevronDown } from 'lucide-react'

import { StaticCard } from '@/components/shared/Cards/StaticCard'
import { cn } from '@/lib/utils'

import { getSectionAppearance } from './constants'
import { FAQQuestionAccordion } from './FAQQuestionAccordion'
import type { FAQSection } from './types'

type FAQSectionAccordionProps = {
  section: FAQSection
  isOpen: boolean
  openQuestionIndex: number | null
  onSectionToggle: () => void
  onQuestionToggle: (questionIndex: number) => void
  sectionQuestionsCountText: string
  expandSectionText: string
  collapseSectionText: string
}

export function FAQSectionAccordion({
  section,
  isOpen,
  openQuestionIndex,
  onSectionToggle,
  onQuestionToggle,
  sectionQuestionsCountText,
  expandSectionText,
  collapseSectionText,
}: FAQSectionAccordionProps) {
  const panelId = `faq-section-panel-${section.id}`
  const titleId = `faq-section-title-${section.id}`
  const appearance = getSectionAppearance(section.id)
  const SectionIcon = appearance.icon

  return (
    <StaticCard className={cn('rounded-[28px] border p-0 shadow-sm', appearance.surfaceClassName)}>
      <button
        type="button"
        id={titleId}
        aria-expanded={isOpen}
        aria-controls={panelId}
        onClick={onSectionToggle}
        className="flex w-full cursor-pointer items-start justify-between gap-4 p-6 text-left md:p-8"
      >
        <div>
          <span
            className={cn(
              'inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em]',
              appearance.badgeClassName
            )}
          >
            <SectionIcon className="h-4 w-4" />
            {section.label}
          </span>
          <h2 className="text-title mt-5 text-3xl font-semibold leading-tight md:text-4xl">{section.title}</h2>
          <p className="mt-3 max-w-3xl text-base leading-relaxed text-textcolor-secondary">{section.description}</p>
          <p className="mt-4 text-sm text-textcolor-secondary">{sectionQuestionsCountText}</p>
          <p className="mt-1 text-sm text-textcolor-secondary">{isOpen ? collapseSectionText : expandSectionText}</p>
        </div>

        <ChevronDown
          aria-hidden
          className={`text-iconcolor-secondary mt-1 h-5 w-5 shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen ? (
        <div
          id={panelId}
          role="region"
          aria-labelledby={titleId}
          className={cn(
            'border-outline-tertiary border-t px-4 pb-4 pt-4 md:px-6 md:pb-6',
            appearance.mutedSurfaceClassName
          )}
        >
          <ol className="space-y-3">
            {section.items.map((item, index) => (
              <li key={item.question}>
                <FAQQuestionAccordion
                  item={item}
                  index={index}
                  sectionId={section.id}
                  isOpen={openQuestionIndex === index}
                  onToggle={onQuestionToggle}
                />
              </li>
            ))}
          </ol>
        </div>
      ) : null}
    </StaticCard>
  )
}
