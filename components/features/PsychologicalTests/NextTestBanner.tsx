import { ArrowRight, Check, CheckCheck } from 'lucide-react'

import Card from '@/components/shared/Cards/Card'
import { Link } from '@/i18n/navigation'
import { Button } from '@/ui/button'

type NextTestBannerProps = {
  label: string
  title: string
  description: string
  hint: string
  cta: string
  nextHref?: string
  /** When true, shows the CheckCheck icon (all tests completed). Defaults to false. */
  isDone?: boolean
}

export function NextTestBanner({
  label,
  title,
  description,
  hint,
  cta,
  nextHref,
  isDone = false,
}: NextTestBannerProps) {
  return (
    <Card type="info">
      <div className="flex flex-row items-start gap-xs text-sm">
        <div className="h-8 w-8">
          {isDone ? (
            <CheckCheck size={32} className="text-white opacity-50" />
          ) : (
            <Check size={32} className="text-white opacity-50" />
          )}
        </div>
        <div className="mt-1 flex flex-col gap-sm">
          <h5 className="remark">{label}</h5>
          <h4>{title}</h4>
          <p>{description}</p>
          {hint && <p className="remark">{hint}</p>}
          {nextHref && (
            <Button asChild className="text-shadow-none">
              <Link href={nextHref}>
                {cta}
                <ArrowRight size={16} className="ml-1.5" />
              </Link>
            </Button>
          )}
        </div>
      </div>
    </Card>
  )
}
