import { CustomCard } from '@/ds/components/CustomCard'
import { cn } from '@/lib/utils'

// change Notes type
type UserNotesCardListProps = {
  className: string
  notes: { [key: string]: string }[]
}

export function UserNotesCardList({ className, notes }: UserNotesCardListProps) {
  console.log('notes in list', notes)
  return (
    <div className={cn('flex flex-col gap-4', className)}>
      {notes.map((note) => (
        <CustomCard key={note.id} variant="smallWithChildren" title="Filters">
          <div>{note.key}</div>
        </CustomCard>
      ))}
    </div>
  )
}
