'use server'

import { cookies } from 'next/headers'

import { CartItemProps } from '@/types/cart'

export const getCartCookies = async () => {
  const cart: CartItemProps[] | [] = JSON.parse(cookies().get('cart')?.value || '[]')

  return cart
}

export const setCartCookies = async (cartItems: CartItemProps[]) => {
  const currentCart = await getCartCookies()
  if (currentCart.length === 0) {
    cookies().set('cart', JSON.stringify(cartItems))
    return
  }
  const updatedCart = [...currentCart]
  cartItems.forEach((newItem) => {
    const existingItemIndex = updatedCart.findIndex((item) => item.id === newItem.id)

    if (existingItemIndex !== -1) {
      updatedCart[`${existingItemIndex}`].quantity = newItem.quantity
    } else {
      updatedCart.push(newItem)
    }
  })

  cookies().set('cart', JSON.stringify(updatedCart))
}

export const deleteCartCookie = async () => {
  cookies().delete('cart')
}
