import { CartItemProps } from '@/types/cart'

export const getCartFromCookiesClient = (): CartItemProps[] => {
  const cookies = document.cookie.split('; ').find((cookie) => cookie.startsWith('cart='))

  if (cookies) {
    try {
      const cart = JSON.parse(decodeURIComponent(cookies.split('=')[1]))

      return Array.isArray(cart) ? cart : []
    } catch (error) {
      console.error('Помилка при парсингу корзини з cookies', error)
      return []
    }
  }

  return []
}

export const setCartToCookies = (cartItems: CartItemProps[]) => {
  const currentCart = getCartFromCookiesClient()
  const updatedCart = [...currentCart]

  cartItems.forEach((newItem) => {
    const existingItemIndex = updatedCart.findIndex((item) => item.id === newItem.id)

    if (existingItemIndex !== -1) {
      updatedCart[`${existingItemIndex}`].quantity = newItem.quantity
    } else {
      updatedCart.push(newItem)
    }
  })
  document.cookie = `cart=${encodeURIComponent(JSON.stringify(updatedCart))}; path=/;`
}
