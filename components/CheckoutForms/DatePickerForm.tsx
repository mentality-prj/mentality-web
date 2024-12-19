'use client'
import React from 'react'
import { DateValue, getLocalTimeZone, parseDate, today } from '@internationalized/date'
import { DatePicker } from '@nextui-org/react'

import { useAddCheckoutContext } from '@/context/addCheckoutContext'

export default function DatePickerForm({ errorMsg }: { errorMsg?: string }) {
  const [value, setValue] = React.useState<DateValue | null>(null)
  const { updateNewCheckoutDetails, newCheckoutData } = useAddCheckoutContext()
  const handleInputChange = (e: DateValue | null) => {
    setValue(e)
    updateNewCheckoutDetails({ ['deliveryDate']: String(e) })
  }

  return (
    <div className="flex w-full flex-wrap gap-4 md:flex-nowrap">
      <DatePicker
        isRequired
        className="max-w-[284px]"
        value={newCheckoutData.deliveryDate?.length === 10 ? parseDate(newCheckoutData.deliveryDate) : value}
        label="Date (controlled)"
        onChange={handleInputChange}
        minValue={today(getLocalTimeZone())}
      />
      <input
        type="hidden"
        name="deliveryDate"
        value={newCheckoutData.deliveryDate ? newCheckoutData.deliveryDate : ''}
      />
      <div className="mt-1 min-h-8">{errorMsg && <span className="block text-sm text-red-500">{errorMsg}</span>}</div>
    </div>
  )
}
