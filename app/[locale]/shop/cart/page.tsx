import Link from 'next/link'

import { getCartCookies } from '@/actions/cart.action'
import CartList from '@/components/Cart/CartList'
import { Routes } from '@/constants/routes'
import ServerMessage from '@/utils/serverMessage'

export default async function CartPage() {
  const data = await getCartCookies()

  return (
    <div className="mx-auto max-w-7xl">
      {data.length ? (
        <CartList />
      ) : (
        <div className="flex flex-col items-center justify-center">
          <div className="mb-4 text-center text-3xl">Your cart is empty</div>
          <Link className="w-[120px] rounded-lg border-1 text-center" href={Routes.SHOP}>
            Back to shop
          </Link>
        </div>
      )}
      <ServerMessage message="Your product is here" type="success" />
    </div>
  )
}
