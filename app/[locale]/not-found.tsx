import Image from 'next/image'
import { useTranslations } from 'next-intl'

import { LandingFooter, LandingHeader } from '@/components/features/Landing'
import Sitemap, { SitemapAdmin } from '@/components/shared/Sitemap'
import { Routes } from '@/constants/routes'
import { Link } from '@/i18n/navigation'
import { Button } from '@/ui/button'

export default function NotFoundPage() {
  const t = useTranslations()
  return (
    <main className="flex min-h-screen w-full flex-col justify-between bg-white">
      <LandingHeader />
      <div
        className="flex-1"
        style={{
          backgroundImage:
            "linear-gradient(to bottom, rgba(255,255,255,1) 0%, rgba(255,255,255,0) 50%), linear-gradient(rgba(255,255,255,0.6), rgba(255,255,255,1)), url('/images/not-found-bg.png')",
          backgroundRepeat: 'repeat',
          backgroundPosition: 'bottom center',
        }}
      >
        <article className="container-max-width container-center container gap-md">
          <h1>{t('common.title.NotFoundPage')}</h1>

          <div className="grid w-full max-w-4xl grid-cols-1 items-start gap-md md:grid-cols-2">
            <Sitemap />

            <div className="">
              <Image
                src="/images/not-found.png"
                alt="Not found"
                width={360}
                height={240}
                className="rounded-[28px]"
                priority
              />
            </div>
          </div>

          <SitemapAdmin />

          <Button variant="volume" asChild>
            <Link href={Routes.MAIN}>{t('components.Navigation.BackToHome')}</Link>
          </Button>
        </article>
      </div>
      <LandingFooter type="small" />
    </main>
  )
}
