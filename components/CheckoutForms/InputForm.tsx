'use client'

import React from 'react'

import { useAddCheckoutContext } from '@/context/addCheckoutContext'
import { Input } from '@/ds/shadcn/input'
import { Label } from '@/ds/shadcn/label'
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
      <Label htmlFor={String(id)}>{label}</Label>
      <Input
        required={required}
        pattern={pattern}
        minLength={minLength}
        min={min}
        maxLength={max}
        id={String(id)}
        name={String(id)}
        onChange={handleInputChange}
        value={newCheckoutData[`${id}`]}
        type={type}
        className={`w-full rounded-md px-2 py-4 ${errorMsg && 'border-red-500'} border-2`}
      />
      <span>{description}</span>
      <div className="mt-1 min-h-8">{errorMsg && <span className="block text-sm text-red-500">{errorMsg}</span>}</div>
    </div>
  )
}
