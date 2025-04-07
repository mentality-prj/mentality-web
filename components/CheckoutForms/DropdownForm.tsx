'use client'

import { useState } from 'react'
import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, SharedSelection } from '@nextui-org/react'

import { months, years } from '@/constants/form'
import { useAddCheckoutContext } from '@/context/addCheckoutContext'
import { Button } from '@/ds/shadcn/button'

export default function DropdownForm({ errorMsg }: { errorMsg?: string }) {
  const [selectedMonth, setSelectedMonth] = useState('select month')
  const [selectedYear, setSelectedYear] = useState('select year')

  const { updateNewCheckoutDetails, newCheckoutData } = useAddCheckoutContext()

  const updateExpirationDate = (month: string, year: string) => {
    if (month === 'select month') {
      updateNewCheckoutDetails({ expirationDate: `/${year.slice(-2)}` })
    } else if (year === 'select year') {
      updateNewCheckoutDetails({ expirationDate: `${month}/` })
    } else {
      updateNewCheckoutDetails({
        expirationDate: `${month}/${year.slice(-2)}`,
      })
    }
  }

  const handleMonthSelection = (key: SharedSelection) => {
    const monthValue = months[Number(key.currentKey)]
    setSelectedMonth(monthValue)
    updateExpirationDate(monthValue, selectedYear)
  }

  const handleYearSelection = (key: SharedSelection) => {
    const yearValue = years[Number(key.currentKey)]
    setSelectedYear(yearValue)
    updateExpirationDate(selectedMonth, yearValue)
  }

  return (
    <div>
      <div className="mt-1 min-h-8">{errorMsg && <span className="block text-sm text-red-500">{errorMsg}</span>}</div>
      <Dropdown>
        <DropdownTrigger>
          <Button className="capitalize">
            {newCheckoutData.expirationDate?.length === 5 ? newCheckoutData.expirationDate.slice(0, 2) : selectedMonth}
          </Button>
        </DropdownTrigger>
        <DropdownMenu
          disallowEmptySelection
          aria-label="Select a month"
          selectionMode="single"
          variant="flat"
          onSelectionChange={(key) => handleMonthSelection(key)}
        >
          {months.map((month, index) => (
            <DropdownItem key={index}>{month}</DropdownItem>
          ))}
        </DropdownMenu>
      </Dropdown>
      {' / '}
      <Dropdown>
        <DropdownTrigger>
          <Button className="capitalize">
            {newCheckoutData.expirationDate?.length === 5 ? newCheckoutData.expirationDate.slice(3, 5) : selectedYear}
          </Button>
        </DropdownTrigger>
        <DropdownMenu
          disallowEmptySelection
          aria-label="Select a year"
          selectionMode="single"
          variant="flat"
          onSelectionChange={(key) => handleYearSelection(key)}
        >
          {years.map((year, index) => (
            <DropdownItem key={index}>{year}</DropdownItem>
          ))}
        </DropdownMenu>
      </Dropdown>
      <input
        type="hidden"
        name="expirationDate"
        value={`${newCheckoutData.expirationDate ? newCheckoutData.expirationDate.slice(0, 2) : ''}/${newCheckoutData.expirationDate ? newCheckoutData.expirationDate.slice(3, 5) : ''}`}
      />
    </div>
  )
}
