'use server'

import { cookies } from 'next/headers'

import { logger } from '@/lib/logger'
import { mockShopData } from '@/REST/mockApi'
import { CartItemCookiesProps } from '@/types/cart'

export const getCartProducts = async () => {
  const cart = await getCartCookies()
  const allProducts = await mockShopData()

  const products = cart
    .map((cartItem) => {
      const product = allProducts.find((product) => product.id === cartItem.id)
      if (!product) return undefined
      return {
        ...product,
        quantity: cartItem.quantity,
      }
    })
    .filter((item): item is NonNullable<typeof item> => item !== undefined)

  return products
}

export const getCartCookies = async () => {
  try {
    const cart: CartItemCookiesProps[] | [] = JSON.parse(cookies().get('cart')?.value || '[]')
    return cart
  } catch (error) {
    logger.error('Failed to parse cart cookies', error)
    return []
  }
}

export const setCartCookies = async (cartItems: CartItemCookiesProps[]) => {
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

export const deleteCartCookies = async () => {
  cookies().delete('cart')
}
