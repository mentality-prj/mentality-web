import Image from 'next/image'
import { useTranslations } from 'next-intl'

import { Routes } from '@/constants/routes'
import { Button } from '@/ds/shadcn/button'
import { Link } from '@/i18n/navigation'

export default function ServerErrorPage() {
  const t = useTranslations('pages.ServerError')

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
        <h1>{t('title')}</h1>

        <div className="grid w-full max-w-4xl grid-cols-1 items-start gap-8 md:grid-cols-2">
          <div>
            <div className="flex flex-col items-start gap-6">
              <p className="text-muted-foreground max-w-md text-lg">{t('description')}</p>
              <div className="flex flex-col items-start gap-3 text-left">
                <h3>{t('suggestions')}</h3>
                <ul className="text-muted-foreground list-decimal space-y-2 text-left text-sm">
                  <li className="ml-4">{t('suggestion1')}</li>
                  <li className="ml-4">{t('suggestion2')}</li>
                  <li className="ml-4">{t('suggestion3')}</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="">
            <Image
              src="/images/server-error.png"
              alt="Server error"
              width={360}
              height={240}
              className="rounded-[28px]"
              priority
            />
          </div>

          <div className="col-span-2 flex justify-center">
            <Button asChild>
              <Link href={Routes.SIGNIN}>{t('backToSignin')}</Link>
            </Button>
          </div>
        </div>
      </article>
    </main>
  )
}
