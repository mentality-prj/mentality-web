import { getTranslations } from 'next-intl/server'

import { SavedList } from '@/components/SavedList/SavedList'
import { Routes } from '@/constants/routes'
import { Button } from '@/ds/shadcn/button'
import { Link } from '@/i18n/navigation'

export async function MySpace() {
  const t = await getTranslations('components.MySpaceCards')

  return (
    <section className="grid gap-default laptop:grid-cols-[3fr_1fr]">
      <div>
        <SavedList />
      </div>

      <div className="flex flex-col gap-sm">
        <h3 className="landing-h3">{t('title')}</h3>
        <Link href={`${Routes.MYNOTES}/my-thoughts`}>
          <Button size="large" className="w-full">
            {t('card1.title')}
          </Button>
        </Link>
        <Link href={`${Routes.MYNOTES}/tests`}>
          <Button variant="secondary" size="large" className="w-full">
            {t('card2.title')}
          </Button>
        </Link>
      </div>
    </section>
  )
}
