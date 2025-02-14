import { getCartCookies } from '@/actions/cart.action'
import TotalPrice from '@/components/Cart/TotalPrice'
import ReviewForm from '@/components/CheckoutForms/ReviewForm'

const ReviewPage = async () => {
  const cartItems = await getCartCookies()

  return (
    <div className="flex flex-col items-center gap-4">
      <TotalPrice cartItems={cartItems} />
      <ReviewForm />
    </div>
  )
}

export default ReviewPage
