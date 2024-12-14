'use client'

import React from 'react'

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
    updateNewCheckoutDetails({ [e.target.name as CheckoutDataKeys]: e.target.value })
  }
  return (
    <div>
      <label className="block text-lg" htmlFor={id}>
        {label}
        {description && <span className="mb-1 block text-sm text-slate-200">{description}</span>}
      </label>
      <input
        className={`w-full rounded-md px-2 py-4 text-white ${
          errorMsg ? 'border-red-500' : 'border-slate-300'
        } border-2`}
        type={type}
        name={id}
        onChange={handleInputChange}
        defaultValue={newCheckoutData[id]}
        id={id}
        required={required}
        pattern={pattern}
        minLength={minLength}
        min={min}
        max={max}
      />
      <div className="mt-1 min-h-8">{errorMsg && <span className="block text-sm text-red-500">{errorMsg}</span>}</div>
    </div>
  )
}
