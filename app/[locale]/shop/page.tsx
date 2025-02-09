import ShopList from '@/components/Shop/ShopList'
import { mockShopData } from '@/REST/mockApi'

export default async function ShopPage() {
  const data = await mockShopData()
  return <div>{data ? <ShopList data={data}></ShopList> : <div>shop is empty</div>}</div>
}
