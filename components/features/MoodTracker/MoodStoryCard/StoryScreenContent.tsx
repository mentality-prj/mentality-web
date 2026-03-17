import { resolveActionRoute } from '@/helpers/moodStory.helpers'
import { Link } from '@/i18n/navigation'
import { MoodStoryScreenEntity } from '@/types/api-responses'
import { Button } from '@/ui/button'

interface StoryScreenContentProps {
  screen: MoodStoryScreenEntity
}

export function StoryScreenContent({ screen }: StoryScreenContentProps) {
  const actionRoute = screen.action ? resolveActionRoute(screen.action) : null

  return (
    <div className="flex flex-col gap-4 py-2">
      <p className="text-sm leading-relaxed text-textcolor-secondary">{screen.text}</p>
      {actionRoute !== null && screen.action && (
        <Button asChild variant="volume" size="medium" className="mt-2 w-full">
          <Link href={actionRoute}>{screen.action}</Link>
        </Button>
      )}
    </div>
  )
}
