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

const LANDING_FOOTER_GRADIENT_STYLE: CSSProperties = {
  backgroundImage:
    'linear-gradient(135deg, rgba(106, 94, 255, 0.2) 0%, rgba(106, 94, 255, 0.2) 24%, transparent 24%), linear-gradient(215deg, rgba(31, 210, 192, 0.2) 10%, rgba(31, 210, 192, 0.2) 36%, transparent 36%), linear-gradient(335deg, rgba(255, 103, 128, 0.2) 18%, rgba(255, 103, 128, 0.2) 44%, transparent 44%), linear-gradient(25deg, rgba(255, 111, 216, 0.2) 28%, rgba(255, 111, 216, 0.2) 56%, transparent 56%), linear-gradient(295deg, rgba(126, 255, 150, 0.2) 20%, rgba(126, 255, 150, 0.2) 42%, transparent 42%), linear-gradient(55deg, rgba(94, 216, 255, 0.2) 26%, rgba(94, 216, 255, 0.2) 54%, transparent 54%), linear-gradient(275deg, rgba(255, 166, 249, 0.2) 34%, rgba(255, 166, 249, 0.2) 58%, transparent 58%)',
  backgroundSize: '160% 160%',
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'calc(50% - 10px) 50%',
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
