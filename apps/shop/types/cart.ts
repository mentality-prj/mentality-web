import { ShopItemCookiesProps, ShopItemProps } from '@/types/shop'

export type CartItemProps = ShopItemProps & {
  quantity: number
}

export type CartItemCookiesProps = ShopItemCookiesProps & {
  quantity: number
}
