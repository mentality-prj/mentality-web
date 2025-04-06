import { getTranslations } from 'next-intl/server'

import { auth } from '@/auth'
import ProfileSettingsForm from '@/components/Profile/ProfileSettingsForm'
import { CardContent, CardDescription, CardHeader, CardTitle } from '@/ds/shadcn'
import { CustomSession } from '@/types/auth'

export default async function ProfileSettingsPage() {
  const session = (await auth()) as CustomSession

  const user = session?.user
  const t = await getTranslations('ProfileSettingsPage')
  return (
    <>
      <CardHeader>
        <CardTitle className="text-2xl">{t('Title')}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4 border-b pb-5">
          <h4 className="font-medium">{t('SubTitle')}</h4>
          <CardDescription>{t('Description')}</CardDescription>
        </div>
        <ProfileSettingsForm user={user!} />
      </CardContent>
    </>
  )
}
