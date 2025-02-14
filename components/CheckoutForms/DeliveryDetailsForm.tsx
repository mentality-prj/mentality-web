'use client'

import { useFormState } from 'react-dom'
import { useTranslations } from 'next-intl'

import { deliveryDetailsFormAction } from '@/actions/delivery-details.action'
import { ErrorsMessage } from '@/types/form'

import DatePickerForm from './DatePickerForm'
import InputForm from './InputForm'
import InputSearchCityForm from './InputSearchCityForm'
import RadioButtonForm from './RadioButtonForm'
import SubmitButton from './SubmitButton'

const initialState: ErrorsMessage = {}

export default function DeliveryDetailsForm() {
  const [serverErrors, formAction] = useFormState(deliveryDetailsFormAction, initialState)
  const t = useTranslations()

  return (
    <form action={formAction} className="flex flex-1 flex-col items-center">
      <div className="flex w-full flex-col lg:max-w-[700px]">
        <InputForm label="Full Name" id="fullName" type="text" errorMsg={serverErrors?.fullName} required />
        <InputSearchCityForm label="City" id="city" type="text" required errorMsg={serverErrors?.city} />
        <RadioButtonForm />
        <DatePickerForm errorMsg={serverErrors?.deliveryDate} />
      </div>
      <SubmitButton text={t('ShopPage.Checkout.Submit')} />
    </form>
  )
}
