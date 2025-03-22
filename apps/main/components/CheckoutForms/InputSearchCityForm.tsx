import React, { useState } from 'react'
import { Input } from '@nextui-org/react'

import { useAddCheckoutContext } from '@/context/addCheckoutContext'
import { CheckoutFormInputProps } from '@/types/checkout'

interface Address {
  Present: string
}

const InputSearchCityForm = ({
  label,
  id,
  required,
  pattern,
  type,
  minLength,
  min,
  max,
  description,
  errorMsg,
}: CheckoutFormInputProps) => {
  const [results, setResults] = useState<Address[]>([])

  const { updateNewCheckoutDetails, newCheckoutData } = useAddCheckoutContext()

  const handleSearchChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    updateNewCheckoutDetails({ ['city']: value })
    if (value.length >= 1) {
      try {
        const res = await fetch(`/api/searchCities?cityName=${value}&limit=10&page=1`)
        const data = await res.json()
        if (data.success) {
          setResults(data.data[0]?.Addresses || [])
        } else {
          setResults([])
        }
      } catch (error) {
        console.log(error)
      }
    }
  }

  const handleSelect = (address: Address) => {
    updateNewCheckoutDetails({ ['city']: address.Present })
    setResults([])
  }

  return (
    <div>
      <div className="mt-1 min-h-8">{errorMsg && <span className="block text-sm text-red-500">{errorMsg}</span>}</div>
      <Input
        isRequired={required}
        pattern={pattern}
        minLength={minLength}
        min={min}
        maxLength={max}
        id={id}
        name={id}
        value={newCheckoutData.city}
        onChange={handleSearchChange}
        label={label}
        description={description}
        type={type}
        className={`w-full rounded-md px-2 py-4 ${errorMsg && 'border-red-500'} border-2`}
        classNames={{ mainWrapper: 'w-full' }}
      />

      {results.length > 0 && (
        <ul className="mt-2 rounded border shadow">
          {results.map((item) => (
            <li key={item.Present}>
              <button type="button" className="cursor-pointer p-2 hover:bg-gray-200" onClick={() => handleSelect(item)}>
                {item.Present}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default InputSearchCityForm
