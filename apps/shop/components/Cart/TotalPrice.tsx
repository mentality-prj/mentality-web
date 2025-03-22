import { useTranslations } from 'next-intl'

import { CartItemProps } from '@/types/cart'

interface TotalPriceProps {
  cartItems: CartItemProps[]
}

export default function TotalPrice({ cartItems }: TotalPriceProps) {
  const totalPrice = Math.round(cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0) * 100) / 100
  const t = useTranslations()
  return (
    <div className="text-2xl">
      {t('CartPage.TotalPrice')}: ${totalPrice}
    </div>
  )
}
