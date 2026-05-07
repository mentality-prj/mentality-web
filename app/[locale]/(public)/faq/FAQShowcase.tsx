'use client'

import { useState } from 'react'
import { useMessages, useTranslations } from 'next-intl'

import { MosaicGrid, MosaicGridItem } from '@/components/shared/Content/MosaicGrid'
import { PageTitle } from '@/ds/components/PageTitle'

import { FAQSectionAccordion } from './FAQSectionAccordion'
import type { FAQPageMessages, FAQSectionId, OpenQuestionIndexes } from './types'

export function FAQShowcase() {
  const t = useTranslations('pages.FAQ')
  const faqMessages = (useMessages() as unknown as FAQPageMessages).pages.FAQ
  const faqSections = faqMessages.sections

  const [openSectionId, setOpenSectionId] = useState<FAQSectionId | null>(null)
  const [openQuestionIndexes, setOpenQuestionIndexes] = useState<OpenQuestionIndexes>({
    b2c: null,
    b2b: null,
    rd: null,
  })

  const handleSectionToggle = (sectionId: FAQSectionId) => {
    setOpenSectionId((currentSectionId) => (currentSectionId === sectionId ? null : sectionId))
  }

  const handleQuestionToggle = (sectionId: FAQSectionId, questionIndex: number) => {
    setOpenQuestionIndexes((currentState) => {
      if (sectionId === 'b2c') {
        return {
          ...currentState,
          b2c: currentState.b2c === questionIndex ? null : questionIndex,
        }
      }

      if (sectionId === 'b2b') {
        return {
          ...currentState,
          b2b: currentState.b2b === questionIndex ? null : questionIndex,
        }
      }

      return {
        ...currentState,
        rd: currentState.rd === questionIndex ? null : questionIndex,
      }
    })
  }

  return (
    <div className="bg-[radial-gradient(circle_at_top_left,rgba(236,253,245,0.9),transparent_30%),radial-gradient(circle_at_top_right,rgba(224,242,254,0.9),transparent_35%),linear-gradient(180deg,#f8fafc_0%,#f6f8ef_100%)] py-12 md:py-16">
      <section className="mb-12 w-full">
        <div className="container-max-width mx-auto px-4 tablet:px-6 md:px-8 lg:px-10">
          <MosaicGrid>
            <MosaicGridItem xlSpan={12}>
              <div className="h-full rounded-[28px] bg-[linear-gradient(145deg,rgba(255,255,255,0.86),rgba(255,255,255,0.58))] p-6 md:p-8">
                <PageTitle title={t('title')} className="max-w-4xl" />
                <p className="mt-5 max-w-3xl text-base leading-relaxed text-textcolor-secondary md:text-lg">
                  {t('intro')}
                </p>
              </div>
            </MosaicGridItem>
          </MosaicGrid>
        </div>
      </section>

      <section className="w-full">
        <div className="container-max-width mx-auto px-4 pb-16 tablet:px-6 md:px-8 lg:px-10">
          <ul className="space-y-6">
            {faqSections.map((section) => (
              <li key={section.id}>
                <FAQSectionAccordion
                  section={section}
                  isOpen={openSectionId === section.id}
                  openQuestionIndex={openQuestionIndexes[section.id]}
                  sectionQuestionsCountText={t('sectionQuestionsCount', { count: section.items.length })}
                  expandSectionText={t('expandSection')}
                  collapseSectionText={t('collapseSection')}
                  onSectionToggle={() => handleSectionToggle(section.id)}
                  onQuestionToggle={(questionIndex) => handleQuestionToggle(section.id, questionIndex)}
                />
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  )
}
