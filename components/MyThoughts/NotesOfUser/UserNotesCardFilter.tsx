import { CustomCard } from '@/ds/components/CustomCard'

type UserNotesCardFilterProps = {
  className?: string
}

export function UserNotesCardFilter({ className }: UserNotesCardFilterProps) {
  //  const t = useTranslations should be added

  return (
    <div className={className}>
      <CustomCard variant="smallWithChildren" title="Filters">
        <div>Here will be Filters </div>
      </CustomCard>
    </div>
  )
}
