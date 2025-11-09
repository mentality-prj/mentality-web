'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'

import { getCartProducts, setCartCookies } from '@/actions/cart.action'
import { Button } from '@/ds/shadcn/button'
import { logger } from '@/lib/logger'
import { CartItemCookiesProps, CartItemProps } from '@/types/cart'

import CartItem from './CartItem'
import TotalPrice from './TotalPrice'

export default function CartList() {
  const router = useRouter()
  const [cartItems, setCartItems] = useState<CartItemProps[]>([])

  useEffect(() => {
    getCartProducts()
      .then((cart) => setCartItems(cart))
      .catch((error) => {
        logger.error('Failed to load cart products', error)
      })
  }, [])

  const handleQuantityChange = async (updatedItem: CartItemCookiesProps) => {
    const updatedCartItems = cartItems.map((item) =>
      item.id === updatedItem.id ? { ...item, quantity: updatedItem.quantity } : item
    )

    setCartItems(updatedCartItems)

    try {
      await setCartCookies(updatedCartItems)
    } catch (error) {
      logger.error('Failed to update cart cookies', error)
    }
  }

  const t = useTranslations()

  return (
    <div className="mt-5 flex max-w-[1200px] gap-10">
      <div className="flex max-w-[800px] flex-col gap-3">
        {cartItems.map((item) => (
          <CartItem key={item.id} {...item} onQuantityChange={handleQuantityChange} />
        ))}
      </div>
      <div className="flex flex-col gap-3 p-1">
        <TotalPrice cartItems={cartItems} />
        <Button onClick={() => router.push('/shop/delivery-details')}>{t('CartPage.Checkout')}</Button>
      </div>
    </div>
  )
}
