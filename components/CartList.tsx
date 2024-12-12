'use client'
import { useEffect, useState } from 'react'
import { Button } from '@nextui-org/react'
import { useRouter } from 'next/navigation'

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

// Зчитування даних з куків
const getCartFromCookies = (): CartItemProps[] => {
  const cookies = document.cookie.split('; ').find((cookie) => cookie.startsWith('cart='))

  if (cookies) {
    try {
      return JSON.parse(decodeURIComponent(cookies.split('=')[1]))
    } catch (error) {
      console.log(error)
      return []
    }
  }
  return []
}

// Запис даних до куків
const setCartToCookies = (cartItems: CartItemProps[]) => {
  document.cookie = `cart=${encodeURIComponent(JSON.stringify(cartItems))}; path=/;`
}

export default function CartList({ data }: CartListProps) {
  const router = useRouter()
  const [cartItems, setCartItems] = useState<CartItemProps[]>([])

  // Ініціалізуємо стан з куків при завантаженні
  useEffect(() => {
    const initialCart = getCartFromCookies()
    setCartItems(initialCart.length > 0 ? initialCart : data)
  }, [data])

  const handleQuantityChange = (updatedItem: CartItemProps) => {
    const updatedCartItems = cartItems.map((item) =>
      item.id === updatedItem.id ? { ...item, quantity: updatedItem.quantity } : item
    )

    setCartItems(updatedCartItems)
    setCartToCookies(updatedCartItems)
  }

  const totalPrice = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)

  return (
    <div className="mt-5 flex max-w-[1200px] gap-10">
      <div className="flex max-w-[800px] flex-col gap-3">
        {cartItems.map((item) => (
          <CartItem key={item.id} {...item} onQuantityChange={handleQuantityChange} />
        ))}
      </div>
      <div className="flex flex-col gap-3 border-1 p-1">
        <div className="">Total price: ${totalPrice}</div>
        <Button onClick={() => router.push('/delivery-details')}>Proceed to Checkout</Button>
      </div>
    </div>
  )
}
