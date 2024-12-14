'use client'

import { useFormState } from 'react-dom'

import { paymentInfoFormAction } from '@/actions/payment-info.action'

import InputForm from './InputForm'
import SubmitButton from './SubmitButton'
import { FormErrors } from './types'

const initialState: FormErrors = {}

export default function PaymentInfoForm() {
  const [serverErrors, formAction] = useFormState(paymentInfoFormAction, initialState)
  return (
    <form action={formAction} className="flex flex-1 flex-col items-center">
      <div className="flex w-full flex-col lg:max-w-[700px]">
        <InputForm label="Card Number" id="cardNumber" type="string" required errorMsg={serverErrors?.cardNumber} />
        <InputForm
          label="Expiration Date"
          id="expirationDate"
          type="string"
          required
          errorMsg={serverErrors?.expirationDate}
        />
        <InputForm label="CVV" id="cvv" type="string" required errorMsg={serverErrors?.cvv} />
      </div>
      <SubmitButton text="Submit" />
    </form>
  )
}
