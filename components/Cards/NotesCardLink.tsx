'use client'
import { NotebookPen } from 'lucide-react'
import { useTranslations } from 'next-intl'

import Card from '@/components/Cards/Card'
import { Button } from '@/ds/shadcn/button'
import { Link } from '@/i18n/navigation'

import { Routes } from '../../constants/routes'

export default function NotesCardLink() {
  const t = useTranslations('components.DailyCard')

  return (
    <Card>
      <Button variant="volume" asChild className="w-full sm:w-auto">
        <Link href={`${Routes.MYNOTES}/my-thoughts`}>
          <NotebookPen size={16} />
          {t('cards.notes')}
        </Link>
      </Button>
    </Card>
  )
}
