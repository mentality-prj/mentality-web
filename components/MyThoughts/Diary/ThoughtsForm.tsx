import { Mic } from 'lucide-react'
import { useTranslations } from 'next-intl'

import { TagsEditor } from '@/components/MoodTracker/NewMoodNoteSection/AddTagsContainer'
import { SectionCard } from '@/ds/components/SectionCard'
import TextareaWithLabel from '@/ds/components/TextareaWithLabel'
import { Button } from '@/ds/shadcn/button'
import { ThoughtsFormProps } from '@/types/thoughtsForm'

export const ThoughtsForm = ({ onTextChange, onSave, content, loading, tags, setTags }: ThoughtsFormProps) => {
  const t = useTranslations('')
  return (
    <SectionCard title={t('MyThougtsPage.RecordingThoughts.title')}>
      <div className="mt-4 flex flex-col gap-6">
        <TextareaWithLabel
          placeholder={t('TextareaWithLabel.placeholder')}
          rightIcon={<Mic className="h-6 w-6 text-iconcolor-secondary" />}
          rows={4}
          value={content}
          onChange={(e) => onTextChange(e.target.value)}
        />
        <TagsEditor tags={tags} onChange={setTags} />
        <div className="flex flex-wrap gap-6 desktop:flex-nowrap">
          <Button disabled className="w-full" variant="secondary">
            {t('MyThougtsPage.RecordingThoughts.Cancel')}
          </Button>
          <Button onClick={onSave} disabled={!content.trim() || loading} className="w-full">
            {t('MyThougtsPage.RecordingThoughts.Save')}
          </Button>
        </div>
      </div>
    </SectionCard>
  )
}
