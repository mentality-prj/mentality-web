import { fontSans } from '@/config/fonts'
import { Link } from '@/i18n/navigation'

type LogoProps = {
  isHeroAnchor?: boolean
}

const Logo = ({ isHeroAnchor = false }: LogoProps) => {
  return (
    <Link href="/" aria-label="Go to homepage">
      <div data-landing-logo={isHeroAnchor ? 'true' : undefined} className="logo">
        <span className="logo-highlight text-primary" style={{ textShadow: '-2px 2px 0 hsl(20 98% 85%)' }}>
          Dzvin.co
        </span>
        <div className={`${fontSans.className} ml-1 text-xs text-textcolor-muted`}>beta</div>
      </div>
    </Link>
  )
}

export default Logo
