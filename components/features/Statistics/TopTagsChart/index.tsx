'use client'

import { useTranslations } from 'next-intl'

import { getMaxTagCount } from '@/helpers/userStatistics.helpers'
import { TopTag } from '@/types/userStatistics'

type TopTagsChartProps = {
  tags: TopTag[]
}

export function TopTagsChart({ tags }: TopTagsChartProps) {
  const t = useTranslations('components.UserStatistics')

  if (tags.length === 0) {
    return (
      <div className="background-alt-white rounded-md p-6">
        <h3 className="text-xl font-semibold text-textcolor-primary">{t('topTags.title')}</h3>
        <p className="py-8 text-center text-sm text-textcolor-secondary">{t('topTags.noData')}</p>
      </div>
    )
  }

  const maxCount = getMaxTagCount(tags)

  return (
    <div className="background-alt-white rounded-md p-6">
      <h3 className="mb-5 text-xl font-semibold text-textcolor-primary">{t('topTags.title')}</h3>
      <div className="flex flex-col gap-3">
        {tags.map((tag) => {
          const widthPercent = maxCount > 0 ? (tag.count / maxCount) * 100 : 0
          return (
            <div key={tag.tag} className="flex items-center gap-3">
              <span className="w-20 shrink-0 text-right text-sm font-medium text-textcolor-primary">{tag.tag}</span>
              <div className="bg-muted relative h-7 flex-1 overflow-hidden rounded-sm">
                <div className="h-full rounded-sm bg-purple-500 transition-all" style={{ width: `${widthPercent}%` }} />
              </div>
              <span className="w-8 text-sm text-textcolor-secondary">{tag.count}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
