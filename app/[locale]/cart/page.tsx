import { auth } from '@/auth'
import CartList from '@/components/CartList'
import { mockCartData } from '@/mockApi'
import { CustomSession } from '@/types/auth'

export default async function CartPage() {
  const session = (await auth()) as CustomSession
  const data = session?.OAuthToken ? await mockCartData(session?.OAuthToken) : null

  return (
    <div className="mx-auto max-w-7xl">
      <CartList data={data} />
    </div>
  )
}
