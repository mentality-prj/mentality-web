'use client'

import { useState } from 'react'

import { MOOD_ACTION_HREF, MOOD_ACTIONS, type MoodAction } from '@/helpers/moodNextStep'
import { Link } from '@/i18n/navigation'
import { Button } from '@/ui/button'

export type MoodActionCopy = {
  choosePrompt: string
  userChoiceNote: string
  options: Record<MoodAction, string>
  suggestions: Record<MoodAction, string>
  actions: Record<MoodAction, string>
}

type Props = {
  suggestedAction: MoodAction
  copy: MoodActionCopy
}

/** An immediate, ephemeral user preference; it is deliberately not stored. */
export function MoodActionPicker({ suggestedAction, copy }: Props) {
  const [selectedAction, setSelectedAction] = useState<MoodAction>(suggestedAction)

  return (
    <div className="flex flex-col gap-sm">
      <p className="text-sm leading-relaxed">{copy.suggestions[selectedAction]}</p>
      <p className="text-sm font-medium">{copy.choosePrompt}</p>
      <div className="flex flex-wrap gap-xs" role="group" aria-label={copy.choosePrompt}>
        {MOOD_ACTIONS.map((action) => (
          <button
            key={action}
            type="button"
            aria-pressed={selectedAction === action}
            onClick={() => setSelectedAction(action)}
            className={[
              'min-h-11 rounded-xl border px-3 py-2 text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2',
              selectedAction === action
                ? 'border-primary bg-primary/10 font-semibold text-textcolor-primary'
                : 'border-current/20 text-textcolor-secondary hover:bg-black/5',
            ].join(' ')}
          >
            {copy.options[action]}
          </button>
        ))}
      </div>
      {selectedAction !== suggestedAction && (
        <p className="text-xs leading-relaxed text-textcolor-secondary">{copy.userChoiceNote}</p>
      )}
      <Button asChild variant="secondary" size="medium" className="w-fit">
        <Link href={MOOD_ACTION_HREF[selectedAction]}>{copy.actions[selectedAction]}</Link>
      </Button>
    </div>
  )
}
