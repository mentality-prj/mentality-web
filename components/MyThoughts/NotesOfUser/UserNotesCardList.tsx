import { CustomCard } from '@/ds/components/CustomCard'
import { cn } from '@/lib/utils'

// change Notes type
type UserNotesCardListProps = {
  className: string
  notes: { [key: string]: string }[]
}

export function UserNotesCardList({ className, notes }: UserNotesCardListProps) {
  return (
    <div className={cn('flex flex-col gap-4', className)}>
      {notes.map((note) => (
        <CustomCard key={note.id} title="Notes cards of user" text={note.key} />
      ))}
    </div>
  )
}
