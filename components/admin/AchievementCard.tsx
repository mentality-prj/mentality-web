import Card from '@/components/shared/Cards/Card'

type Props = {
  iconClass?: string
  title: string
  subtitle?: string
  count?: number
  cardClass?: string
}

export default function AchievementCard({ iconClass, title, subtitle, count = 0, cardClass }: Props) {
  const cls = cardClass ? cardClass : ''

  return (
    <Card className={`h-full border ${cls}`} sup={count ? String(count) : undefined}>
      <div className="flex flex-col items-center justify-center py-6 text-center">
        {iconClass ? <i className={`fi ${iconClass} mb-3 text-4xl`} aria-hidden /> : null}

        <span className="mb-1 text-lg font-medium">{title}</span>
        {subtitle && <p className="text-sm">{subtitle}</p>}
      </div>
    </Card>
  )
}
