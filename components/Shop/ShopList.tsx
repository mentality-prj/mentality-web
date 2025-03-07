import { ShopItemProps } from '@/types/shop'

import ShopItem from './ShopItem'

export interface ShopListProps {
  data: ShopItemProps[]
}

const ShopList = ({ data }: ShopListProps) => {
  const dataShop = data

  return (
    <div className="flex grid-cols-2 flex-col gap-5 bg-gray-600 p-3 sm:grid md:grid-cols-3 xl:grid-cols-5">
      {dataShop.map((product) => (
        <ShopItem key={product.id} {...product} />
      ))}
    </div>
  )
}

export default ShopList
