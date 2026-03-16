'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight, RefreshCw, X } from 'lucide-react'
import { useTranslations } from 'next-intl'

import FullScreenBackdrop from '@/components/shared/FullScreenContainers/FullScreenBackdrop/FullScreenBackdrop'
import Loading from '@/components/shared/Loading'
import { Routes } from '@/constants/routes'
import { useMoodStory } from '@/hooks/useMoodStory'
import { Link } from '@/i18n/navigation'
import { logger } from '@/lib/logger'
import { cn } from '@/lib/utils'
import { MoodStoryScreenEntity } from '@/types/api-responses'
import { Button } from '@/ui/button'

// ---------------------------------------------------------------------------
// Action → route mapping
// Free-form Ukrainian action strings from AI are matched against these patterns.
// If no pattern matches, the CTA button is silently omitted.
// ---------------------------------------------------------------------------
const ACTION_ROUTES: [RegExp, string][] = [
  [/дихальн/i, Routes.GUIDE],
  [/медитац/i, Routes.MEDITATIONS],
  [/вправ/i, Routes.GUIDE],
  [/стрес/i, Routes.MOODTRACKER],
  [/настрій|мудж/i, Routes.MOODTRACKER],
  [/сон|відпочин/i, Routes.GUIDE],
]

function resolveActionRoute(action: string): string | null {
  for (const [pattern, route] of ACTION_ROUTES) {
    if (pattern.test(action)) return route
  }
  return null
}

// ---------------------------------------------------------------------------
// Internal sub-components
// ---------------------------------------------------------------------------

function StoryLoadingSkeleton() {
  const t = useTranslations('components.MoodStoryCard.loading')
  return (
    <div className="flex flex-col gap-4 py-4" aria-label={t('ariaLabel')} aria-busy="true">
      <div className="h-6 w-3/4 animate-pulse rounded-lg bg-background-muted" />
      <div className="h-4 w-full animate-pulse rounded-lg bg-background-muted" />
      <div className="h-4 w-5/6 animate-pulse rounded-lg bg-background-muted" />
      <div className="h-4 w-4/6 animate-pulse rounded-lg bg-background-muted" />
      <p className="text-textcolor-tertiary mt-2 text-center text-sm">{t('text')}</p>
    </div>
  )
}

function StoryNotReady() {
  const t = useTranslations('components.MoodStoryCard.notReady')
  return (
    <div className="flex flex-col items-center gap-3 py-6 text-center">
      <p className="text-base font-medium">{t('title')}</p>
      <p className="text-textcolor-tertiary text-sm">{t('description')}</p>
    </div>
  )
}

interface StoryErrorProps {
  onRetry: () => void
}

function StoryError({ onRetry }: StoryErrorProps) {
  const t = useTranslations('components.MoodStoryCard.error')
  return (
    <div className="flex flex-col items-center gap-4 py-6 text-center">
      <p className="text-base font-medium">{t('title')}</p>
      <p className="text-textcolor-tertiary text-sm">{t('description')}</p>
      <Button variant="secondary" size="medium" onClick={onRetry}>
        <RefreshCw size={16} />
        {t('retryCta')}
      </Button>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Progress dots
// ---------------------------------------------------------------------------

interface ProgressDotsProps {
  total: number
  current: number
}

function ProgressDots({ total, current }: ProgressDotsProps) {
  const t = useTranslations('components.MoodStoryCard')
  return (
    <div
      className="flex items-center justify-center gap-2"
      role="status"
      aria-label={t('progressDots.ariaLabel', { current: current + 1, total })}
    >
      {Array.from({ length: total }, (_, i) => (
        <div
          key={i}
          aria-hidden="true"
          className={cn(
            'h-2 rounded-full transition-all duration-300',
            i === current ? 'w-6 bg-primary' : 'w-2 bg-background-muted'
          )}
        />
      ))}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Story screen renderer
// ---------------------------------------------------------------------------

interface StoryScreenProps {
  screen: MoodStoryScreenEntity
}

function StoryScreenContent({ screen }: StoryScreenProps) {
  const actionRoute = screen.action ? resolveActionRoute(screen.action) : null
  const loggedActionsRef = useRef<Set<string>>(new Set())

  useEffect(() => {
    if (screen.action && actionRoute === null && !loggedActionsRef.current.has(screen.action)) {
      loggedActionsRef.current.add(screen.action)
      logger.warn('MoodStoryCard: unknown action, skipping CTA button', { action: screen.action })
    }
  }, [screen.action, actionRoute])

  return (
    <div className="flex flex-col gap-4 py-2">
      <h2 className="text-xl font-semibold leading-snug">{screen.title}</h2>
      <p className="text-sm leading-relaxed text-textcolor-secondary">{screen.text}</p>
      {actionRoute !== null && screen.action && (
        <Button asChild variant="volume" size="medium" className="mt-2 w-full">
          <Link href={actionRoute}>{screen.action}</Link>
        </Button>
      )}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export function MoodStoryCard() {
  const { state, retry } = useMoodStory()
  const t = useTranslations('components.MoodStoryCard.card')
  const [showStory, setShowStory] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)

  const screens = state.status === 'success' ? state.story.screens : []
  const dialogRef = useRef<HTMLDivElement>(null)

  // Clamp currentIndex when screens array shrinks after retry
  useEffect(() => {
    if (screens.length > 0 && currentIndex >= screens.length) {
      setCurrentIndex(screens.length - 1)
    }
  }, [screens.length, currentIndex])

  const handleOpen = () => {
    if (state.status === 'idle' || state.status === 'not-ready' || state.status === 'error') {
      retry()
    }
    setCurrentIndex(0)
    setShowStory(true)
  }

  const handleClose = useCallback(() => setShowStory(false), [])

  const goNext = useCallback(
    () =>
      setCurrentIndex((i) => {
        const maxIndex = Math.max(screens.length - 1, 0)
        return Math.min(i + 1, maxIndex)
      }),
    [screens.length]
  )
  const goPrev = useCallback(() => setCurrentIndex((i) => Math.max(i - 1, 0)), [])

  // Focus trap + arrow key navigation
  useEffect(() => {
    if (!showStory) return

    const dialog = dialogRef.current
    if (dialog) dialog.focus()

    const handleKey = (e: KeyboardEvent) => {
      // Focus trap for Tab / Shift+Tab
      if (e.key === 'Tab' && dialog) {
        const focusable = dialog.querySelectorAll<HTMLElement>(
          'button:not([disabled]), a[href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        )
        if (focusable.length === 0) {
          e.preventDefault()
          return
        }
        const first = focusable[0]
        const last = focusable[focusable.length - 1]
        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault()
            last.focus()
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault()
            first.focus()
          }
        }
        return
      }

      if (e.metaKey || e.ctrlKey || e.altKey || e.shiftKey) return
      if (screens.length === 0) return
      if (e.key === 'ArrowRight') {
        e.preventDefault()
        goNext()
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault()
        goPrev()
      }
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [showStory, goNext, goPrev, screens.length])

  const isLoading = state.status === 'loading' || state.status === 'polling'

  return (
    <>
      {/* Entry card */}
      <div className="bg-background-secondary relative flex flex-col gap-3 rounded-2xl p-6">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h4 className="text-base font-semibold">{t('title')}</h4>
            <p className="text-textcolor-tertiary mt-1 text-sm">{t('description')}</p>
          </div>
          {isLoading && <Loading size={18} className="text-textcolor-tertiary mt-1 shrink-0" />}
        </div>
        <Button variant="volume" onClick={handleOpen} className="w-full" aria-label={t('viewCta')}>
          {t('viewCta')}
        </Button>
      </div>

      {/* Story overlay */}
      {showStory && (
        <>
          <FullScreenBackdrop onClick={handleClose} />
          <div
            ref={dialogRef}
            // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex -- focus trap sentinel for dialog
            tabIndex={0}
            className="fixed inset-0 z-50 flex items-center justify-center px-4 outline-none"
            aria-modal="true"
            role="dialog"
            aria-label={t('modalTitle')}
          >
            <div className="flex w-full max-w-md flex-col gap-5 rounded-3xl bg-background p-6 shadow-lg">
              {/* Header */}
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">{t('modalTitle')}</h3>
                <Button variant="ghost" size="icon" onClick={handleClose} aria-label={t('closeAriaLabel')}>
                  <X size={20} />
                </Button>
              </div>

              {/* Content area */}
              {isLoading ? (
                <StoryLoadingSkeleton />
              ) : state.status === 'not-ready' ? (
                <StoryNotReady />
              ) : state.status === 'error' ? (
                <StoryError onRetry={retry} />
              ) : state.status === 'success' && screens.length > 0 ? (
                <>
                  <ProgressDots total={screens.length} current={currentIndex} />

                  <div aria-live="polite" aria-atomic="true">
                    {/* eslint-disable-next-line security/detect-object-injection -- currentIndex is internal numeric state, not user input */}
                    <StoryScreenContent screen={screens[currentIndex]} />
                  </div>

                  {/* Navigation */}
                  <div className="flex items-center justify-between pt-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={goPrev}
                      disabled={currentIndex === 0}
                      aria-label={t('prevAriaLabel')}
                    >
                      <ChevronLeft size={20} />
                    </Button>
                    <span className="text-textcolor-tertiary text-xs">
                      {currentIndex + 1} / {screens.length}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={goNext}
                      disabled={currentIndex === screens.length - 1}
                      aria-label={t('nextAriaLabel')}
                    >
                      <ChevronRight size={20} />
                    </Button>
                  </div>
                </>
              ) : (
                <StoryNotReady />
              )}
            </div>
          </div>
        </>
      )}
    </>
  )
}
