'use client'
import { useEffect, useState } from 'react'
import Image from 'next/image'
import { useTranslations } from 'next-intl'

import { getCartProducts, setCartCookies } from '@/actions/cart.action'
import { Button } from '@/ds/shadcn/button'
import { CartItemProps } from '@/types/cart'
import { ShopItemProps } from '@/types/shop'

const ShopItem = ({ id, name, price, image }: ShopItemProps) => {
  const [cartItems, setCartItems] = useState<CartItemProps[]>([])

  useEffect(() => {
    getCartProducts().then((cart) => setCartItems(cart))
  }, [])

  const addToCart = () => {
    setCartCookies([{ id, quantity: 1 }])
    getCartProducts().then((cart) => setCartItems(cart))
  }

  const isAddedToCart = cartItems.some((item) => item.id === id)

  const t = useTranslations()

  return (
    <div className="flex max-h-[300px] flex-col justify-between rounded-md border border-gray-300 p-4 text-center">
      <div>{name.slice(0, 10)}</div>
      <Image width={144} height={144} src={image} alt={name} className="mx-auto my-2 h-36 w-36 object-cover" />
      <div className="mt-auto">
        <div className="">
          {t('ShopPage.Price')}: {price}
        </div>
        {isAddedToCart ? (
          <div>{t('ShopPage.Added')}</div>
        ) : (
          <Button onClick={addToCart}>{t('ShopPage.AddToCart')}</Button>
        )}
      </div>
    </div>
  )
}

export default ShopItem
