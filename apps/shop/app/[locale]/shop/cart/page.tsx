import { getCartProducts } from '@/actions/cart.action'
import CartEmpty from '@/components/Cart/CartEmpty'
import CartList from '@/components/Cart/CartList'
import ServerMessage from '@/utils/serverMessage'

export default async function CartPage() {
  const data = await getCartProducts()

  return (
    <div className="mx-auto max-w-7xl">
      {data.length ? <CartList /> : <CartEmpty />}
      <ServerMessage message="Your product is here" type="success" />
    </div>
  )
}
