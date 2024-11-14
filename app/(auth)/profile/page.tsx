import { auth } from '@/auth'
import { SignOut } from '@/components/signout-button'
import { mockProfileData } from '@/mockApi.js'

export default async function ProfilePage() {
  const session = await auth()
  const data = session?.accessToken ? await mockProfileData(session?.accessToken) : null

  return (
    <div className="flex flex-col items-center gap-10">
      {data && (
        <div className="flex flex-col gap-5">
          <div className="">{data.name}</div>
          <div className="">{data.email}</div>

          {data.image && <img src={data.image} />}
        </div>
      )}
      <SignOut />
    </div>
  )
}
