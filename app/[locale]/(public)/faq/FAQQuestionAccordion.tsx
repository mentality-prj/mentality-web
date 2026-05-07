import { ChevronDown } from 'lucide-react'

import { StaticCard } from '@/components/shared/Cards/StaticCard'
import { Link } from '@/i18n/navigation'
import { cn } from '@/lib/utils'

import { getSectionAppearance } from './constants'
import type { FAQItem, FAQSectionId } from './types'

type FAQQuestionAccordionProps = {
  item: FAQItem
  index: number
  sectionId: FAQSectionId
  isOpen: boolean
  onToggle: (questionIndex: number) => void
}

export function FAQQuestionAccordion({ item, index, sectionId, isOpen, onToggle }: FAQQuestionAccordionProps) {
  const panelId = `faq-question-panel-${sectionId}-${index}`
  const titleId = `faq-question-title-${sectionId}-${index}`
  const appearance = getSectionAppearance(sectionId)

  return (
    <StaticCard
      className={cn('border-outline-tertiary rounded-[24px] border p-0 shadow-sm', appearance.summaryClassName)}
    >
      <button
        type="button"
        id={titleId}
        aria-expanded={isOpen}
        aria-controls={panelId}
        onClick={() => onToggle(index)}
        className="flex w-full cursor-pointer items-start justify-between gap-4 p-5 text-left md:p-6"
      >
        <h3 className="text-base font-semibold leading-snug text-textcolor-primary md:text-lg">{item.question}</h3>
        <ChevronDown
          aria-hidden
          className={`text-iconcolor-secondary mt-0.5 h-5 w-5 shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen ? (
        <div
          id={panelId}
          role="region"
          aria-labelledby={titleId}
          className="border-outline-tertiary border-t bg-[linear-gradient(145deg,rgba(255,255,255,0.92),rgba(255,255,255,0.72))] px-5 pb-5 pt-4 md:px-6"
        >
          <div className="space-y-3">
            {item.answer.map((paragraph, idx) =>
              typeof paragraph === 'string' ? (
                <p key={idx} className="text-sm leading-relaxed text-textcolor-secondary md:text-base">
                  {paragraph}
                </p>
              ) : (
                <p key={idx} className="text-sm leading-relaxed text-textcolor-secondary md:text-base">
                  {paragraph.text}
                  <Link
                    href={paragraph.href}
                    className="underline underline-offset-2 transition-colors hover:text-textcolor-primary"
                  >
                    {paragraph.linkText}
                  </Link>
                  {paragraph.linkSuffix}
                </p>
              )
            )}
          </div>
        </div>
      ) : null}
    </StaticCard>
  )
}
