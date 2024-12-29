'use client'

import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'

import { reviewFormAction } from '@/actions/review.action'
import { useAddCheckoutContext } from '@/context/addCheckoutContext'
import { NewCheckout } from '@/schema'

import SubmitButton from './SubmitButton'

export default function ReviewForm() {
  const { newCheckoutData, resetLocalStorage } = useAddCheckoutContext()
  const router = useRouter()
  const { cardNumber, city, cvv, deliveryDate, deliveryMethod, expirationDate, fullName } = newCheckoutData

  const handleFormSubmit = async () => {
    const { success, errorMsg, redirect } = await reviewFormAction(newCheckoutData as NewCheckout)
    if (success) {
      toast.success('Order submitted successfully')
      resetLocalStorage()
      document.cookie = `cart=${encodeURIComponent(JSON.stringify(''))}; path=/;`
    } else if (errorMsg) {
      toast.error(errorMsg)
    }
    if (redirect) {
      return router.push(redirect)
    }
  }
  return (
    <form action={handleFormSubmit} className="flex flex-1 flex-col items-center gap-2">
      <div className="flex w-full flex-col lg:max-w-[700px]">
        <p className="text-xl md:text-3xl">full name: {fullName}</p>
        <p className="text-xl md:text-3xl">card number: {cardNumber}</p>
        <p className="text-xl md:text-3xl">city: {city}</p>
        <p className="text-xl md:text-3xl">cvv: {cvv}</p>
        <p className="text-xl md:text-3xl">delivery date: {deliveryDate}</p>
        <p className="text-xl md:text-3xl">delivery method: {deliveryMethod}</p>
        <p className="text-xl md:text-3xl">expiration date: {expirationDate}</p>
      </div>

      <SubmitButton text="Confirm" />
    </form>
  )
}
