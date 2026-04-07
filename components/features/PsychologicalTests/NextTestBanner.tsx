import { ArrowRight, CheckCircle2 } from 'lucide-react'

import { Link } from '@/i18n/navigation'
import { Button } from '@/ui/button'

type NextTestBannerProps = {
  label: string
  title: string
  description: string
  hint: string
  cta: string
  /** undefined means this is the last test — CTA button is hidden */
  nextHref?: string
}

export function NextTestBanner({ label, title, description, hint, cta, nextHref }: NextTestBannerProps) {
  const isDone = !nextHref

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-start gap-3">
        <CheckCircle2 size={20} className={isDone ? 'mt-0.5 shrink-0 text-success' : 'mt-0.5 shrink-0 text-primary'} />
        <div className="flex flex-col gap-1">
          <span className="text-xs font-medium uppercase tracking-wide text-textcolor-secondary">{label}</span>
          <span className="font-semibold text-textcolor-primary">{title}</span>
          <p className="text-sm text-textcolor-secondary">{description}</p>
          {hint && <p className="text-textcolor-tertiary text-xs italic">{hint}</p>}
        </div>
      </div>
      {!isDone && (
        <Button asChild variant="default" className="shrink-0">
          <Link href={nextHref}>
            {cta}
            <ArrowRight size={16} className="ml-1.5" />
          </Link>
        </Button>
      )}
    </div>
  )
}
