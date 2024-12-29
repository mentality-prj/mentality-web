'use client'

import React from 'react'
import { Input } from '@nextui-org/react'

import { useAddCheckoutContext } from '@/context/addCheckoutContext'
import { CheckoutFormInputProps } from '@/types/checkout'

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
}: CheckoutFormInputProps) {
  const { updateNewCheckoutDetails, newCheckoutData } = useAddCheckoutContext()
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.name === 'cardNumber') {
      const value = e.target.value
        .replace(/\D/g, '')
        .replace(/(.{4})/g, '$1 ')
        .trim()
      updateNewCheckoutDetails({ [e.target.name]: value })
    } else if (e.target.name === 'cvv') {
      const value = e.target.value.replace(/\D/g, '').trim()
      updateNewCheckoutDetails({ [e.target.name]: value })
    } else {
      updateNewCheckoutDetails({ [e.target.name]: e.target.value })
    }
  }
  return (
    <div>
      <Input
        isRequired={required}
        pattern={pattern}
        minLength={minLength}
        min={min}
        maxLength={max}
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
