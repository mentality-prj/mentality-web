import { cookies } from 'next/headers'

import ReviewForm from '@/components/CheckoutForms/ReviewForm'

const ReviewPage = async () => {
  const cookiesdata = await cookies().get('cart')
  let data
  if (cookiesdata) {
    data = JSON.parse(cookiesdata?.value)
  }
  console.log(data)
  return (
    <div className="flex">
      <ReviewForm />
      <div className="">
        <div>Your order: </div>
        {/* {data && data.map((item) => <div key={item.id}>{item.name}</div>)} */}
      </div>
    </div>
  )
}

export default ReviewPage
