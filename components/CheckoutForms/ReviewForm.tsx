'use client'

import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'

import { reviewFormAction } from '@/actions/review.action'
import { useAddCheckoutContext } from '@/context/addCheckoutContext'
import { NewCheckout } from '@/schema'

import SubmitButton from './SubmitButton'

export default function ReviewForm() {
  const { newCheckoutData, resetData } = useAddCheckoutContext()
  const router = useRouter()
  const { cardNumber, city, cvv, deliveryDate, deliveryMethod, expirationDate, fullName } = newCheckoutData

  const handleFormSubmit = async () => {
    const { success, errorMsg, redirect } = await reviewFormAction(newCheckoutData as NewCheckout)
    if (success) {
      toast.success('Order submitted successfully')
      resetData()
    } else if (errorMsg) {
      toast.error(errorMsg)
    }
    if (redirect) {
      return router.push(redirect)
    }
  }
  return (
    <form action={handleFormSubmit} className="flex flex-1 flex-col items-stretch gap-2 lg:max-w-[700px]">
      <p className="text-xl md:text-3xl">Name: {fullName}</p>
      <p className="text-xl md:text-3xl">Name: {cardNumber}</p>
      <p className="text-xl md:text-3xl">Name: {city}</p>
      <p className="text-xl md:text-3xl">Name: {cvv}</p>
      <p className="text-xl md:text-3xl">Name: {deliveryDate}</p>
      <p className="text-xl md:text-3xl">Name: {deliveryMethod}</p>
      <p className="text-xl md:text-3xl">Name: {expirationDate}</p>

      <SubmitButton text="Submit" />
    </form>
  )
}
