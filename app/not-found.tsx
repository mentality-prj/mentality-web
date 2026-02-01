import Image from 'next/image'
import { useTranslations } from 'next-intl'

import Sitemap from '@/components/Sitemap'
import { Routes } from '@/constants/routes'
import { Button } from '@/ds/shadcn/button'
import { Link } from '@/i18n/navigation'

export default function NotFoundPage() {
  const t = useTranslations()
  return (
    <main
      style={{
        backgroundImage:
          "linear-gradient(to bottom, rgba(255,255,255,1) 0%, rgba(255,255,255,0) 50%), linear-gradient(rgba(255,255,255,0.6), rgba(255,255,255,1)), url('/images/not-found-bg.png')",
        backgroundRepeat: 'repeat',
        backgroundPosition: 'bottom center',
      }}
    >
      <article className="container-max-width container-center container gap-8">
        <h1>{t('common.title.NotFoundPage')}</h1>

        <div className="grid w-full max-w-4xl grid-cols-1 items-start gap-8 md:grid-cols-2">
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

        <Button variant="volume" asChild>
          <Link href={Routes.MAIN}>{t('components.Navigation.BackToHome')}</Link>
        </Button>
      </article>
    </main>
  )
}
