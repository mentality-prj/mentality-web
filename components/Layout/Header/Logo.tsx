import { Link } from '@/i18n/navigation'

const Logo = () => {
  return (
    <Link href="/" aria-label="Go to homepage">
      <div data-landing-logo className="logo">
        <span className="logo-highlight text-primary" style={{ textShadow: '-2px 2px 0 hsl(20 98% 85%)' }}>
          Dzvin.co
        </span>
      </div>
    </Link>
  )
}

export default Logo
