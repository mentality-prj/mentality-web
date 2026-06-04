'use client'

import { useContext } from 'react'
import { useTranslations } from 'next-intl'

import { FilterContext, SortContext } from '@/context/FilterContext'
import { Button } from '@/ds/shadcn/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/ds/shadcn/dropdown-menu'
import { ToggleGroup, ToggleGroupItem } from '@/ds/shadcn/toggle-group'
import { cn } from '@/lib/utils'

export const Filter = () => {
  const { sort, setSort } = useContext(SortContext)
  const { filter, setFilter } = useContext(FilterContext)

  const itemsFilter = ['affirmation', 'tip']
  const itemsSort = ['newest', 'oldest']
  const t = useTranslations('AffirmationsPage')

  return (
    <>
      <div className="flex max-h-fit flex-col gap-5 rounded-md border border-outline-secondary p-6">
        <div className="flex justify-between">
          <div className="">{t('filter.title')}</div>

          <Button
            variant="linkButton"
            onClick={() => {
              setFilter('')
              setSort('newest')
            }}
            disabled={!filter && sort === 'newest'}
          >
            {t('filter.clear')}
          </Button>
        </div>
        <div className="">
          <div className="pb-5">{t('filter.by tags')}</div>

          <div className="flex flex-wrap gap-2">
            <ToggleGroup
              className="flex-wrap justify-start gap-2"
              type="single"
              onValueChange={(value) => {
                setFilter(value || '')
              }}
            >
              {itemsFilter.map((item) => (
                <ToggleGroupItem
                  value={item}
                  aria-label={`Toggle ${item}`}
                  key={item}
                  className={cn(
                    'max-h-[22px] rounded-xs bg-secondary px-3 py-1 text-xs/[14px] text-textcolor-secondary',
                    filter === item ? "data-[state='on']:bg-primary data-[state='on']:text-reversed" : ''
                  )}
                >
                  {t(`${item}Tag`)}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          </div>
        </div>
        <hr />

        <div className="">{t('filter.sort')}</div>
        <DropdownMenu>
          <DropdownMenuTrigger className="rounded-md border border-outline-secondary px-4 py-3">
            {t(`filter.${sort}`)}
          </DropdownMenuTrigger>
          <DropdownMenuContent className="p-0">
            <DropdownMenuGroup className="bg-surface-white">
              {itemsSort.map((item) => (
                <DropdownMenuItem
                  className="cursor-pointer hover:bg-secondary-hover hover:text-textcolor-purple"
                  onClick={() => setSort(item)}
                  key={item}
                >
                  {t(`filter.${item}`)}
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </>
  )
}
