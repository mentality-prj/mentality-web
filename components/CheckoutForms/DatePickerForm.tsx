'use client'
import React from 'react'
import { format, isBefore, startOfDay } from 'date-fns'
import { CalendarIcon } from 'lucide-react'

import { useAddCheckoutContext } from '@/context/addCheckoutContext'
import { Button } from '@/ds/shadcn/button'
import { Calendar } from '@/ds/shadcn/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/ds/shadcn/popover'
import { cn } from '@/lib/utils'

export default function DatePickerForm({ errorMsg }: { errorMsg?: string }) {
  const [date, setDate] = React.useState<Date>()
  const today = startOfDay(new Date())
  const { updateNewCheckoutDetails, newCheckoutData } = useAddCheckoutContext()
  const handleInputChange = (e: Date | undefined) => {
    setDate(e)
    updateNewCheckoutDetails({ ['deliveryDate']: e?.toJSON().slice(0, 10) })
  }

  return (
    <div className="flex w-full flex-wrap gap-4 md:flex-nowrap">
      <Popover>
        <PopoverTrigger asChild>
          <Button className={cn('w-[240px] justify-start text-left font-normal')}>
            <CalendarIcon />
            {date ? format(date, 'P') : <span>Pick a date</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            disabled={(date) => isBefore(startOfDay(date), today)}
            mode="single"
            selected={date}
            onSelect={(e) => handleInputChange(e)}
            initialFocus
          />
        </PopoverContent>
      </Popover>
      <input
        type="hidden"
        name="deliveryDate"
        value={newCheckoutData.deliveryDate ? newCheckoutData.deliveryDate : ''}
      />
      <div className="mt-1 min-h-8">{errorMsg && <span className="block text-sm text-red-500">{errorMsg}</span>}</div>
    </div>
  )
}
