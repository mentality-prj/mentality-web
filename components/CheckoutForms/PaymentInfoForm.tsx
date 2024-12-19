'use client'

import { useFormState } from 'react-dom'
import { Form } from '@nextui-org/react'

import { paymentInfoFormAction } from '@/actions/payment-info.action'
import { FormErrors } from '@/types/form'

import DropdownForm from './DropdownForm'
import InputForm from './InputForm'
import SubmitButton from './SubmitButton'

const initialState: FormErrors = {}

export default function PaymentInfoForm() {
  const [serverErrors, formAction] = useFormState(paymentInfoFormAction, initialState)

  return (
    <Form action={formAction} className="flex flex-1 flex-col items-center">
      <div className="flex w-full flex-col lg:max-w-[700px]">
        <InputForm
          label="Card Number"
          max={19}
          id="cardNumber"
          type="string"
          required
          errorMsg={serverErrors?.cardNumber}
        />
        <DropdownForm errorMsg={serverErrors?.expirationDate} />
        <InputForm
          label="CVV"
          description="3-digit code on the back of your card."
          id="cvv"
          max={3}
          type="string"
          required
          errorMsg={serverErrors?.cvv}
        />
      </div>
      <SubmitButton text="Submit" />
    </Form>
  )
}
