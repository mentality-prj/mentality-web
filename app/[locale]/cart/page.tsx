import CartList from '@/components/CartList'
import { mockCartData } from '@/mockApi'

export default async function CartPage() {
  const data = await mockCartData()

  return <div className="mx-auto max-w-7xl">{data ? <CartList data={data} /> : <div>Your cart is empty</div>}</div>
}
