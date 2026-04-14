'use client'

import { type ReactNode, useEffect, useState } from 'react'
import { CalendarClock, Info, ListChecks, Sparkles, TrendingUp } from 'lucide-react'
import { useTranslations } from 'next-intl'

import CloseIconButton from '@/components/shared/Buttons/CloseIconButton'
import Card from '@/components/shared/Cards/Card'
import FullScreenBackdrop from '@/components/shared/FullScreenContainers/FullScreenBackdrop/FullScreenBackdrop'
import { Button } from '@/ui/button'

const GUIDE_SEEN_KEY = 'mood-guide-seen'

const STEP_ICONS = [
  <div key={0} className="rounded-full bg-info p-4 text-white">
    <ListChecks className="h-8 w-8" />
  </div>,
  <div key={1} className="rounded-full bg-support p-4 text-white">
    <CalendarClock className="h-8 w-8" />
  </div>,
  <div key={2} className="rounded-full bg-note p-4 text-white">
    <Sparkles className="h-8 w-8" />
  </div>,
  <div key={3} className="rounded-full bg-success p-4 text-white">
    <TrendingUp className="h-8 w-8" />
  </div>,
]

const TOTAL_STEPS = STEP_ICONS.length
type StepIndex = 1 | 2 | 3 | 4

const getStepIcon = (s: number): ReactNode => {
  switch (s) {
    case 0:
      return STEP_ICONS[0]
    case 1:
      return STEP_ICONS[1]
    case 2:
      return STEP_ICONS[2]
    case 3:
      return STEP_ICONS[3]
    default:
      return STEP_ICONS[0]
  }
}

export function MoodInsightGuide() {
  const t = useTranslations('components.Mood.Guide')
  const [open, setOpen] = useState(false)
  const [step, setStep] = useState(0)

  useEffect(() => {
    try {
      if (!localStorage.getItem(GUIDE_SEEN_KEY)) setOpen(true)
    } catch {
      // localStorage unavailable (e.g. private browsing restrictions) — skip auto-open
    }
  }, [])

  const isLast = step === TOTAL_STEPS - 1

  const handleClose = () => {
    try {
      localStorage.setItem(GUIDE_SEEN_KEY, '1')
    } catch {
      // ignore storage errors
    }
    setOpen(false)
    setStep(0)
  }

  const handleNext = () => (isLast ? handleClose() : setStep((s) => s + 1))
  const handlePrev = () => setStep((s) => s - 1)
  const handleOpen = () => {
    setStep(0)
    setOpen(true)
  }

  return (
    <>
      <Button variant="iconTool" onClick={handleOpen} aria-label={t('openLabel')} className="h-7 w-7">
        <Info size={20} />
      </Button>

      {open && (
        <>
          <FullScreenBackdrop onClick={handleClose} />
          <div role="dialog" aria-modal="true" aria-label={t('openLabel')} className="absolute inset-0 z-50">
            <Card className="flex flex-col gap-sm" tools={<CloseIconButton onClick={handleClose} />}>
              <div className="flex flex-col items-center gap-5 text-center">
                {getStepIcon(step)}

                <div className="flex flex-col gap-2 px-2">
                  <h3 className="mb-0.5 text-xl">{t(`step${step + 1}.title` as `step${StepIndex}.title`)}</h3>
                  <p className="text-sm leading-relaxed text-textcolor-secondary">
                    {t(`step${step + 1}.description` as `step${StepIndex}.description`)}
                  </p>
                </div>
              </div>

              {/* Pagination dots */}
              <div className="flex justify-center gap-2">
                {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setStep(i)}
                    aria-label={`${t('stepLabel')} ${i + 1}`}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      i === step ? 'w-6 bg-primary' : 'w-2 bg-border'
                    }`}
                  />
                ))}
              </div>

              {/* Navigation */}
              <div className="flex gap-xs">
                {step > 0 && (
                  <Button variant="secondary" className="flex-1" onClick={handlePrev}>
                    {t('prev')}
                  </Button>
                )}
                <Button variant="volume" className="flex-1" onClick={handleNext}>
                  {isLast ? t('done') : t('next')}
                </Button>
              </div>
            </Card>
          </div>
        </>
      )}
    </>
  )
}
