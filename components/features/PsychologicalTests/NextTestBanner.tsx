import { Check, CheckCheck } from 'lucide-react'

import { InfoBanner } from '@/ds/components/InfoBanner'

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
    <InfoBanner
      icon={
        isDone ? (
          <CheckCheck size={32} className="text-white opacity-50" />
        ) : (
          <Check size={32} className="text-white opacity-50" />
        )
      }
      type="info"
      label={label}
      title={title}
      description={<p>{description}</p>}
      hint={hint}
      cta={cta}
      href={nextHref}
    />
  )
}
