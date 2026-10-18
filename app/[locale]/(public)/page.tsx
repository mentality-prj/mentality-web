import { getServerSession } from '@/lib/auth/server'

import { FeatureCardsSection } from './components/FeatureCardsSection'
import { HeroSection } from './components/HeroSection'
import { HowItWorksSection } from './components/HowItWorksSection'
import { ServicesSection } from './components/ServicesSection'

export default async function LandingPage() {
  const session = await getServerSession()
  const isAuthenticated = Boolean(session?.user)

  return (
    <>
      <HeroSection isAuthenticated={isAuthenticated} />
      <FeatureCardsSection />
      <ServicesSection />
      <HowItWorksSection isAuthenticated={isAuthenticated} />
    </>
  )
}
