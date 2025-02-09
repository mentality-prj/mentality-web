'use client'
import { useEffect, useState } from 'react'
import { Button } from '@nextui-org/react'
import Image from 'next/image'

import { CartItemProps } from '@/types/cart'
import { ShopItemProps } from '@/types/shop'
import { getCartFromCookiesClient, setCartToCookies } from '@/utils/cartUtils'

const ShopItem = ({ id, name, description, price, image }: ShopItemProps) => {
  const [cartItems, setCartItems] = useState<CartItemProps[]>([])
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)

    setCartItems(getCartFromCookiesClient())
  }, [])

  const addToCart = () => {
    setCartToCookies([{ id, name, description, price, image, quantity: 1 }])
    setCartItems(getCartFromCookiesClient())
  }

  const isAddedToCart = cartItems.some((item) => item.id === id)

  if (!isClient) {
    return null
  }

  return (
    <div className="flex max-h-[300px] flex-col justify-between rounded-md border border-gray-300 p-4 text-center">
      <div>{name.slice(0, 10)}</div>
      <Image width={144} height={144} src={image} alt={name} className="mx-auto my-2 h-36 w-36 object-cover" />
      <div className="mt-auto">
        <div className="">Price: {price}</div>
        {isAddedToCart ? <div>Added</div> : <Button onPress={addToCart}>Add to cart</Button>}
      </div>
    </div>
  )
}

export default ShopItem
