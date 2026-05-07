import { Building2, FlaskConical, HeartPulse } from 'lucide-react'

import type { FAQSectionAppearance, FAQSectionId } from './types'

export const sectionAppearances: Record<FAQSectionId, FAQSectionAppearance> = {
  b2c: {
    icon: HeartPulse,
    badgeClassName: 'bg-emerald-100 text-emerald-700',
    surfaceClassName: 'bg-emerald-50/80',
    mutedSurfaceClassName: 'bg-emerald-50/65',
    summaryClassName: 'border-emerald-100 bg-emerald-50/70',
  },
  b2b: {
    icon: Building2,
    badgeClassName: 'bg-sky-100 text-sky-700',
    surfaceClassName: 'bg-sky-50/80',
    mutedSurfaceClassName: 'bg-sky-50/65',
    summaryClassName: 'border-sky-100 bg-sky-50/70',
  },
  rd: {
    icon: FlaskConical,
    badgeClassName: 'bg-amber-100 text-amber-800',
    surfaceClassName: 'bg-amber-50/80',
    mutedSurfaceClassName: 'bg-amber-50/65',
    summaryClassName: 'border-amber-100 bg-amber-50/70',
  },
}

export function getSectionAppearance(sectionId: FAQSectionId): FAQSectionAppearance {
  if (sectionId === 'b2c') {
    return sectionAppearances.b2c
  }

  if (sectionId === 'b2b') {
    return sectionAppearances.b2b
  }

  return sectionAppearances.rd
}
