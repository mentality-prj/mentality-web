'use client'

import { useAddCheckoutContext } from '@/context/addCheckoutContext'
import { Label } from '@/ds/shadcn/label'
import { RadioGroup, RadioGroupItem } from '@/ds/shadcn/radio-group'

export default function RadioButtonForm() {
  const { updateNewCheckoutDetails, newCheckoutData } = useAddCheckoutContext()
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateNewCheckoutDetails({ ['deliveryMethod']: e.target.value })
  }
  return (
    <div>
      <Label htmlFor="deliveryMethod">Select your delivery</Label>
      <RadioGroup
        required
        id="deliveryMethod"
        value={newCheckoutData.deliveryMethod}
        orientation="horizontal"
        name="deliveryMethod"
        onChange={handleInputChange}
      >
        <RadioGroupItem value="nova-poshta">Nova Poshta Branch</RadioGroupItem>
        <RadioGroupItem value="courier-delivery">Courier Delivery</RadioGroupItem>
      </RadioGroup>
    </div>
  )
}
