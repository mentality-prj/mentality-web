// import Image from 'next/image'

import { Link } from '@/i18n/navigation'

const Logo = () => {
  return (
    <Link href="/" aria-label="Go to homepage">
      <div data-landing-logo className="logo">
        <span>Dzvin.co</span>
        {/* <Image src="/logo-green.svg" alt="Dzvin.co" width={40} height={40} priority={false} className="h-10 w-10" /> */}
        {/* <span>co</span> */}
      </div>
    </Link>
  )
}

export default Logo
