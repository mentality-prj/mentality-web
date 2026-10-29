import { CSSProperties } from 'react'
import { Linkedin } from 'lucide-react'

export type LandingFooterType = 'small' | 'default'

export const LANDING_FOOTER_SOCIAL_LINKS = [
  {
    name: 'LinkedIn',
    href: 'https://www.linkedin.com/company/dzvin-co/',
    icon: <Linkedin className="icon" size={24} />,
  },
] as const

/** Resonance motif: faint bell-like rings rising from the bottom centre. */
const LANDING_FOOTER_GRADIENT_STYLE: CSSProperties = {
  backgroundImage:
    'radial-gradient(ellipse 70% 120% at 50% 100%, transparent 0%, transparent 45%, #f4f0ff 75%), repeating-radial-gradient(circle at 50% 130%, rgba(107, 88, 217, 0.08) 0 1px, transparent 1px 40px), linear-gradient(180deg, #f8f6ff 0%, #efe9ff 100%)',
}

export function getLandingFooterLayout(type: LandingFooterType = 'default') {
  const paddingY = type === 'small' ? 'py-7' : 'py-5 md:py-10'
  const marginTop = 'mt-0'
  const background = type === 'small' ? {} : LANDING_FOOTER_GRADIENT_STYLE

  return {
    paddingY,
    marginTop,
    background,
  }
}
