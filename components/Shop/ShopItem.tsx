'use client'
import { useEffect, useState } from 'react'
import { Button } from '@nextui-org/react'
import Image from 'next/image'

import { getCartCookies, setCartCookies } from '@/actions/cart.action'
import { CartItemProps } from '@/types/cart'
import { ShopItemProps } from '@/types/shop'

const ShopItem = ({ id, name, description, price, image }: ShopItemProps) => {
  const [cartItems, setCartItems] = useState<CartItemProps[]>([])

  useEffect(() => {
    getCartCookies().then((cart) => setCartItems(cart))
  }, [])

  const addToCart = () => {
    setCartCookies([{ id, name, description, price, image, quantity: 1 }])
    getCartCookies().then((cart) => setCartItems(cart))
  }

  const isAddedToCart = cartItems.some((item) => item.id === id)

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
