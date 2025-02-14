import { useTranslations } from 'next-intl'

import { CartItemProps } from '@/types/cart'

interface TotalPriceProps {
  cartItems: CartItemProps[]
}

export default function TotalPrice({ cartItems }: TotalPriceProps) {
  const totalPrice = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const t = useTranslations()
  return (
    <div className="text-2xl">
      {t('CartPage.TotalPrice')}: ${totalPrice}
    </div>
  )
}
