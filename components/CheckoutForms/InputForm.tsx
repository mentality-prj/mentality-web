'use client'

import React from 'react'
import { Input } from '@nextui-org/react'

import { useAddCheckoutContext } from '@/context/addCheckoutContext'
import { NewCheckout } from '@/schema'

type CheckoutDataKeys = keyof NewCheckout

interface InputProps {
  label: string
  id: CheckoutDataKeys
  description?: string
  required?: boolean
  pattern?: string
  type: string
  minLength?: number
  min?: number
  max?: number
  errorMsg?: string
}

export default function InputForm({
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
}: InputProps) {
  const { updateNewCheckoutDetails, newCheckoutData } = useAddCheckoutContext()
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateNewCheckoutDetails({ [e.target.name]: e.target.value })
  }
  return (
    <div>
      <Input
        isRequired={required}
        pattern={pattern}
        minLength={minLength}
        min={min}
        max={max}
        id={id}
        name={id}
        onChange={handleInputChange}
        value={newCheckoutData[id]}
        label={label}
        description={description}
        type={type}
        className={`w-full rounded-md px-2 py-4 ${errorMsg && 'border-red-500'} border-2`}
        classNames={{ mainWrapper: 'w-full' }}
      />

      <div className="mt-1 min-h-8">{errorMsg && <span className="block text-sm text-red-500">{errorMsg}</span>}</div>
    </div>
  )
}
