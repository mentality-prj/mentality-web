'use client'

import { useState } from 'react'

import { months, years } from '@/constants/form'
import { useAddCheckoutContext } from '@/context/addCheckoutContext'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/ds/shadcn/select'

export default function DropdownForm({ errorMsg }: { errorMsg?: string }) {
  const [selectedMonth, setSelectedMonth] = useState('')
  const [selectedYear, setSelectedYear] = useState('')

  const { updateNewCheckoutDetails, newCheckoutData } = useAddCheckoutContext()

  const updateExpirationDate = (month: string, year: string) => {
    if (!month) {
      updateNewCheckoutDetails({ expirationDate: `/${year.slice(-2)}` })
    } else if (!year) {
      updateNewCheckoutDetails({ expirationDate: `${month}/` })
    } else {
      updateNewCheckoutDetails({ expirationDate: `${month}/${year.slice(-2)}` })
    }
  }

  const handleMonthChange = (value: string) => {
    setSelectedMonth(value)
    updateExpirationDate(value, selectedYear)
  }

  const handleYearChange = (value: string) => {
    setSelectedYear(value)
    updateExpirationDate(selectedMonth, value)
  }

  return (
    <div>
      <div className="mt-1 min-h-8">{errorMsg && <span className="block text-sm text-red-500">{errorMsg}</span>}</div>
      <div className="flex items-center gap-2">
        <Select value={selectedMonth} onValueChange={handleMonthChange} defaultValue="">
          <SelectTrigger className="w-[120px] capitalize">
            <SelectValue
              placeholder={
                newCheckoutData.expirationDate?.length === 5
                  ? newCheckoutData.expirationDate.slice(0, 2)
                  : selectedMonth
              }
            />
          </SelectTrigger>
          <SelectContent>
            {months.map((month, index) => (
              <SelectItem key={index} value={month}>
                {month}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <span>/</span>
        <Select value={selectedYear} onValueChange={handleYearChange} defaultValue="">
          <SelectTrigger className="w-[120px] capitalize">
            <SelectValue
              placeholder={
                newCheckoutData.expirationDate?.length === 5 ? newCheckoutData.expirationDate.slice(3, 5) : selectedYear
              }
            />
          </SelectTrigger>
          <SelectContent>
            {years.map((year, index) => (
              <SelectItem key={index} value={year}>
                {year.slice(2)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <input
        type="hidden"
        name="expirationDate"
        value={`${newCheckoutData.expirationDate ? newCheckoutData.expirationDate.slice(0, 2) : ''}/${newCheckoutData.expirationDate ? newCheckoutData.expirationDate.slice(3, 5) : ''}`}
      />
    </div>
  )
}
