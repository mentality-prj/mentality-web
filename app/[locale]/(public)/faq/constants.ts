import { Building2, FlaskConical, HeartPulse } from 'lucide-react'

import type { FAQSectionAppearance, FAQSectionId } from './types'

export const sectionAppearances: Record<FAQSectionId, FAQSectionAppearance> = {
  b2c: {
    icon: HeartPulse,
    badgeClassName: 'bg-emerald-50 text-[#2f7a56]',
    surfaceClassName: 'bg-[linear-gradient(145deg,rgba(216,250,228,0.96),rgba(187,247,208,0.9))]',
    mutedSurfaceClassName: 'bg-[linear-gradient(145deg,rgba(216,250,228,0.96),rgba(187,247,208,0.9))]',
    summaryClassName: 'bg-[linear-gradient(145deg,rgba(216,250,228,0.56),rgba(187,247,208,0.65))]',
  },
  b2b: {
    icon: Building2,
    badgeClassName: 'bg-sky-100 text-[#2f668f]',
    surfaceClassName: 'bg-[linear-gradient(145deg,rgba(212,232,255,0.96),rgba(147,197,253,0.88))]',
    mutedSurfaceClassName: 'bg-[linear-gradient(145deg,rgba(212,232,255,0.96),rgba(147,197,253,0.88))]',
    summaryClassName: 'bg-[linear-gradient(145deg,rgba(212,232,255,0.56),rgba(147,197,253,0.65))]',
  },
  rd: {
    icon: FlaskConical,
    badgeClassName: 'bg-violet-200 text-[#7a3db8]',
    surfaceClassName:
      'bg-[linear-gradient(145deg,rgba(227,203,248,0.98)_0%,rgba(204,155,246,0.92)_56%,rgba(219,93,234,0.88)_100%)]',
    mutedSurfaceClassName:
      'bg-[linear-gradient(145deg,rgba(227,203,248,0.98)_0%,rgba(204,155,246,0.92)_56%,rgba(219,93,234,0.88)_100%)]',
    summaryClassName:
      'bg-[linear-gradient(145deg,rgba(227,203,248,0.46)_0%,rgba(204,155,246,0.66)_56%,rgba(219,93,234,0.76)_100%)]',
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
