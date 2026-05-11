import { ReactNode } from 'react'

import { ArrowRight } from 'lucide-react'

import Card from '@/components/shared/Cards/Card'
import { Link } from '@/i18n/navigation'
import { StatusType } from '@/types/status.types'
import { Button } from '@/ui/button'

type Props = {
  /** Lucide icon or any ReactNode rendered on the left (32×32 area) */
  icon?: ReactNode
  /** Card background type — same values as Card `type` prop (e.g. "info", "success", "warn", "error") */
  type?: StatusType
  /** Small remark label above the title */
  label?: string
  /** Main heading (h4) */
  title?: ReactNode
  /** Body content rendered below the title */
  description?: ReactNode
  /** Small remark text rendered below description */
  hint?: string
  /** CTA button label. Requires `href` to render. */
  cta?: string
  /** Internal href for the CTA button (uses next-intl Link). Requires `cta` to render. */
  href?: string
}

export function InfoBanner({ icon, type = 'info', label, title, description, hint, cta, href }: Props) {
  const isCompact = !label && !description && !hint && !cta && !href

  return (
    <Card type={type}>
      <div className={`flex flex-row gap-xs text-sm ${isCompact ? 'items-center' : 'items-start'}`}>
        {icon && <div className="h-8 w-8 shrink-0">{icon}</div>}
        <div className={`${isCompact ? '' : 'mt-1'} flex flex-col gap-sm`}>
          {label && <h5 className="remark">{label}</h5>}
          {title && <h4>{title}</h4>}
          {description}
          {hint && <p className="remark">{hint}</p>}
          {href && cta && (
            <Button asChild className="text-shadow-none">
              <Link href={href}>
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
