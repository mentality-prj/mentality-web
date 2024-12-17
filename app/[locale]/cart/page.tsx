import CartList from '@/components/CartList'
import { mockCartData } from '@/REST/mockApi'
import ServerMessage from '@/utils/serverMessage'

export default async function CartPage() {
  const data = await mockCartData()

  return (
    <div className="mx-auto max-w-7xl">
      {data ? <CartList data={data} /> : <div className="text-center">Your cart is empty</div>}
      <ServerMessage message="Your product is here" type="success" />
    </div>
  )
}
