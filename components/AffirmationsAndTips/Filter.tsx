'use client'

import { useContext } from 'react'

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

export const Filter = () => {
  const { sort, setSort } = useContext(SortContext)
  const { filter, setFilter } = useContext(FilterContext)
  console.log(filter)
  return (
    <>
      <div className="flex max-h-fit flex-col gap-5 rounded-md border border-outline-secondary p-6">
        <div className="flex justify-between">
          <div className="">Фільтри</div>
          <Button variant="linkButton">Очистити</Button>
        </div>
        <div className="">
          <div className="pb-5">За тегами</div>
          <div className="flex flex-wrap gap-2">
            <ToggleGroup
              className="flex-wrap justify-start gap-2"
              type="single"
              onValueChange={(value) => {
                setFilter(value || '')
              }}
            >
              <ToggleGroupItem
                value="affirmation"
                aria-label={`Toggle Афірмація`}
                key={'Афірмація'}
                className="max-h-[22px] rounded-xs bg-secondary px-3 py-1 text-xs/[14px] text-textcolor-secondary data-[state='on']:bg-primary data-[state='on']:text-reversed"
              >
                Афірмація
              </ToggleGroupItem>
              <ToggleGroupItem
                value="tip"
                aria-label={`Toggle Порада`}
                key={'Порада'}
                onClick={() => setFilter('Порада')}
                className="max-h-[22px] rounded-xs bg-secondary px-3 py-1 text-xs/[14px] text-textcolor-secondary data-[state='on']:bg-primary data-[state='on']:text-reversed"
              >
                Порада
              </ToggleGroupItem>
            </ToggleGroup>
          </div>
        </div>
        <hr />
        <div className="">Сортування</div>
        <DropdownMenu>
          <DropdownMenuTrigger className="rounded-md border border-outline-secondary px-4 py-3">
            {sort}
          </DropdownMenuTrigger>
          <DropdownMenuContent className="p-0">
            <DropdownMenuGroup className="bg-surface-white">
              <DropdownMenuItem
                className="cursor-pointer hover:bg-secondary-hover hover:text-textcolor-purple"
                onClick={() => setSort('newest')}
              >
                Спочатку найновіші
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer hover:bg-secondary-hover hover:text-textcolor-purple"
                onClick={() => setSort('oldest')}
              >
                Спочатку найстаріші
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </>
  )
}
