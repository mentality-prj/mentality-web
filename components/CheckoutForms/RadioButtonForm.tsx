'use client'

import { useAddCheckoutContext } from '@/context/addCheckoutContext'
import { Label } from '@/ds/shadcn/label'
import { RadioGroup, RadioGroupItem } from '@/ds/shadcn/radio-group'

export default function RadioButtonForm() {
  const { updateNewCheckoutDetails, newCheckoutData } = useAddCheckoutContext()

  const handleInputChange = (value: string) => {
    updateNewCheckoutDetails({ deliveryMethod: value })
  }

  return (
    <div>
      <Label htmlFor="deliveryMethod" className="mb-2 block">
        Select your delivery
      </Label>
      <RadioGroup
        id="deliveryMethod"
        name="deliveryMethod"
        defaultValue={newCheckoutData.deliveryMethod}
        onValueChange={handleInputChange}
        className="flex gap-4"
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="courier-delivery" id="courier-delivery" />
          <Label htmlFor="courier-delivery">Courier Delivery</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="nova-poshta" id="nova-poshta" />
          <Label htmlFor="nova-poshta">Nova Poshta Branch</Label>
        </div>
      </RadioGroup>
    </div>
  )
}
