'use client'
import { useState } from 'react'
import { Button } from '@nextui-org/react'

import CartItem from './CartItem'

export interface CartItemProps {
  id: string
  name: string
  price: number
  quantity: number
  image: string
  description: string
}

interface CartListProps {
  data: CartItemProps[]
}

export default function CartList({ data }: CartListProps) {
  const [cartItems, setCartItems] = useState<CartItemProps[]>(data)

  const handleQuantityChange = (updatedItem: CartItemProps) => {
    setCartItems((prev) =>
      prev.map((item) => (item.id === updatedItem.id ? { ...item, quantity: updatedItem.quantity } : item))
    )
  }

  const totalPrice = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)

  return (
    <div className="mt-5 flex max-w-[1200px] gap-10">
      <div className="flex max-w-[800px] flex-col gap-3">
        {cartItems.map((item) => (
          <CartItem key={item.id} {...item} onQuantityChange={handleQuantityChange} />
        ))}
      </div>
      <div className="border-1 p-1">
        <div className="">Total price: ${totalPrice}</div>
        <Button>Checkout</Button>
      </div>
    </div>
  )
}
