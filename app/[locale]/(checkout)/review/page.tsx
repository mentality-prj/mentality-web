import { cookies } from 'next/headers'

import TotalPrice from '@/components/Cart/TotalPrice'
import ReviewForm from '@/components/CheckoutForms/ReviewForm'
import { CartItemProps } from '@/types/cart'

const getCartFromCookiesServer = (): CartItemProps[] => {
  const cookieStore = cookies()
  const cartCookie = cookieStore.get('cart')

  if (cartCookie) {
    try {
      return JSON.parse(decodeURIComponent(cartCookie.value))
    } catch (error) {
      console.log(error)
      return []
    }
  }
  return []
}

const ReviewPage = async () => {
  const cartItems = getCartFromCookiesServer()

  return (
    <div className="flex flex-col items-center gap-4">
      <TotalPrice cartItems={cartItems} />
      <ReviewForm />
    </div>
  )
}

export default ReviewPage
