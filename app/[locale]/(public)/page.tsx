import { getServerSession } from '@/lib/auth/server'

import { FeatureCardsSection } from './components/FeatureCardsSection'
import { HeroSection } from './components/HeroSection'
import { PlatformHeroSection } from './components/PlatformHeroSection'
import { PlatformProductsSection } from './components/PlatformProductsSection'

export default async function LandingPage() {
  const session = await getServerSession()
  const isAuthenticated = Boolean(session?.user)

  return (
    <>
      <PlatformHeroSection isAuthenticated={isAuthenticated} />
      <PlatformProductsSection />
      <HeroSection isAuthenticated={isAuthenticated} />
      <FeatureCardsSection isAuthenticated={isAuthenticated} />
    </>
  )
}
