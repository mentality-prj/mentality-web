'use client'

import { useLocale } from 'next-intl'

import { resolveActionRoute } from '@/helpers/moodStory.helpers'
import { Link } from '@/i18n/navigation'
import { MoodStoryLocalizedString, MoodStoryScreenEntity } from '@/types/api-responses'
import { SupportedLanguage } from '@/types/languages'
import { Button } from '@/ui/button'

interface StoryScreenContentProps {
  screen: MoodStoryScreenEntity
}

function localizedText(field: MoodStoryLocalizedString, locale: SupportedLanguage): string {
  // eslint-disable-next-line security/detect-object-injection
  return field[locale] ?? field.en
}

export function StoryScreenContent({ screen }: StoryScreenContentProps) {
  const locale = useLocale() as SupportedLanguage
  const actionRoute = screen.action ? resolveActionRoute(screen.action) : null

  return (
    <div className="flex flex-col gap-4 py-2">
      <p className="text-sm leading-relaxed text-textcolor-secondary">{localizedText(screen.text, locale)}</p>
      {actionRoute !== null && (
        <Button asChild variant="volume" size="medium" className="mt-2 w-full">
          <Link href={actionRoute}>{screen.action}</Link>
        </Button>
      )}
    </div>
  )
}
