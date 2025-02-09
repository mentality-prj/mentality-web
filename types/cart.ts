import { ShopItemProps } from '@/types/shop'

export type CartItemProps = ShopItemProps & {
  quantity: number
}
