import { ShopItemProps } from '@/types/shop'

import ShopItem from './ShopItem'

export interface ShopListProps {
  data: ShopItemProps[]
}

const ShopList = ({ data }: ShopListProps) => {
  const dataShop = data

  return (
    <div className="grid grid-cols-8 gap-5 bg-gray-600 p-3">
      {dataShop.map((product) => (
        <ShopItem key={product.id} {...product} />
      ))}
    </div>
  )
}

export default ShopList
