'use client'

import { Radio, RadioGroup } from '@nextui-org/react'

import { useAddCheckoutContext } from '@/context/addCheckoutContext'

export default function RadioButtonForm({ errorMsg }: { errorMsg?: string }) {
  const { updateNewCheckoutDetails, newCheckoutData } = useAddCheckoutContext()
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.name)
    updateNewCheckoutDetails({ ['deliveryMethod']: e.target.value })
  }
  return (
    <div className="">
      <RadioGroup
        isRequired
        id="deliveryMethod"
        value={newCheckoutData.deliveryMethod}
        orientation="horizontal"
        name="deliveryMethod"
        onChange={handleInputChange}
        label="Select your delivery"
      >
        <Radio value="courier-delivery">Courier Delivery</Radio>
        <Radio value="nova-poshta">Nova Poshta Branch</Radio>
      </RadioGroup>
      <div className="mt-1 min-h-8">{errorMsg && <span className="block text-sm text-red-500">{errorMsg}</span>}</div>
    </div>
  )
}
