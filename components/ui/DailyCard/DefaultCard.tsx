import { useLocale, useTranslations } from 'next-intl'

import { Button } from '@/ds/shadcn/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/ds/shadcn/card'
import { Link } from '@/i18n/navigation'
import { cn } from '@/lib/utils'
import { DefaultDailyCardProps } from '@/types/dailyCard'
import { SupportedLanguage } from '@/types/languages'

export const DefaultCard: React.FC<DefaultDailyCardProps> = ({ type, translations, className }) => {
  const t = useTranslations('components.DailyCard')
  const locale = useLocale() as SupportedLanguage
  return (
    <Card className={cn('grid gap-2 border-none bg-surface-white p-4 shadow-none', className)}>
      <CardHeader className="p-0">
        <CardTitle className="flex min-h-[3rem] items-center text-base font-medium text-textcolor-tertiary">
          <p className="m-0 line-clamp-2">{t('title', { type })}</p>
        </CardTitle>
      </CardHeader>

      <CardContent className="flex-grow p-0">
        <p className="line-clamp-4 text-xl/6 font-semibold">&quot;{translations[locale]}&quot;</p>
      </CardContent>

      <CardFooter className="mt-2 p-0">
        <Link href="/my-notes/affirmations">
          <Button className="ml-auto max-h-4 p-0" variant="textButton">
            {t('buttonText', { type })}
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}
