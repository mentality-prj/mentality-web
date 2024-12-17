'use client'

import React from 'react'
import { useFormState } from 'react-dom'

import { deliveryDetailsFormAction } from '@/actions/delivery-details.action'

import InputForm from './InputForm'
import RadioButtonForm from './RadioButtonForm'
import SubmitButton from './SubmitButton'
import { FormErrors } from './types'

const initialState: FormErrors = {}

export default function DeliveryDetailsForm() {
  const [serverErrors, formAction] = useFormState(deliveryDetailsFormAction, initialState)

  return (
    <form action={formAction} className="flex flex-1 flex-col items-center">
      <div className="flex w-full flex-col lg:max-w-[700px]">
        <InputForm label="Full Name" id="fullName" type="text" errorMsg={serverErrors?.fullName} required />
        <InputForm label="City" id="city" type="text" required errorMsg={serverErrors?.city} />
        <RadioButtonForm />
        <InputForm label="Delivery Date" id="deliveryDate" type="text" required errorMsg={serverErrors?.deliveryDate} />
      </div>
      <SubmitButton text="Submit" />
    </form>
  )
}
