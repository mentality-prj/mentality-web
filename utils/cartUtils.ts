import { CartItemProps } from '@/types/cart'

export const getCartFromCookiesClient = (): CartItemProps[] => {
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

export const setCartToCookies = (cartItems: CartItemProps[]) => {
  document.cookie = `cart=${encodeURIComponent(JSON.stringify(cartItems))}; path=/;`
}
