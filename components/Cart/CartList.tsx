'use client'
import { useEffect, useState } from 'react'
import { Button } from '@nextui-org/react'
import { useRouter } from 'next/navigation'

import { CartItemProps } from '@/types/cart'
import { getCartFromCookiesClient, setCartToCookies } from '@/utils/cartUtils'

import CartItem from './CartItem'
import TotalPrice from './TotalPrice'

export interface CartListProps {
  data: CartItemProps[]
}

export default function CartList({ data }: CartListProps) {
  const router = useRouter()
  const [cartItems, setCartItems] = useState<CartItemProps[]>([])

  useEffect(() => {
    const initialCart = getCartFromCookiesClient()
    setCartItems(initialCart.length > 0 ? initialCart : data)
  }, [data])

  const handleQuantityChange = (updatedItem: CartItemProps) => {
    const updatedCartItems = cartItems.map((item) =>
      item.id === updatedItem.id ? { ...item, quantity: updatedItem.quantity } : item
    )

    setCartItems(updatedCartItems)
    setCartToCookies(updatedCartItems)
  }

  return (
    <div className="mt-5 flex max-w-[1200px] gap-10">
      <div className="flex max-w-[800px] flex-col gap-3">
        {cartItems.map((item) => (
          <CartItem key={item.id} {...item} onQuantityChange={handleQuantityChange} />
        ))}
      </div>
      <div className="flex flex-col gap-3 p-1">
        <TotalPrice cartItems={cartItems} />
        <Button onPress={() => router.push('/shop/delivery-details')}>Proceed to Checkout</Button>
      </div>
    </div>
  )
}
