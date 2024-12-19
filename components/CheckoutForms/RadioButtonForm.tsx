'use client'

import { Radio, RadioGroup } from '@nextui-org/react'

import { useAddCheckoutContext } from '@/context/addCheckoutContext'

export default function RadioButtonForm() {
  const { updateNewCheckoutDetails, newCheckoutData } = useAddCheckoutContext()
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateNewCheckoutDetails({ ['deliveryMethod']: e.target.value })
  }
  return (
    <div>
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
    </div>
  )
}
