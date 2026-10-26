import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'

import { getServerSession } from '@/lib/auth/server'
import { publicPageMetadata } from '@/lib/seo/publicPageMetadata'

import { BusinessInvitationSection } from './components/BusinessInvitationSection'
import { FeatureCardsSection } from './components/FeatureCardsSection'
import { HeroSection } from './components/HeroSection'
import { PlatformHeroSection } from './components/PlatformHeroSection'
import { PlatformProductsSection } from './components/PlatformProductsSection'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'pages.Landing.seo' })
  return publicPageMetadata({ locale, path: '/', title: t('title'), description: t('description') })
}

export default async function LandingPage() {
  const session = await getServerSession()
  const isAuthenticated = Boolean(session?.user)

  return (
    <>
      <PlatformHeroSection isAuthenticated={isAuthenticated} />
      <PlatformProductsSection />
      <HeroSection isAuthenticated={isAuthenticated} />
      <FeatureCardsSection isAuthenticated={isAuthenticated} />
      <BusinessInvitationSection />
    </>
  )
}
