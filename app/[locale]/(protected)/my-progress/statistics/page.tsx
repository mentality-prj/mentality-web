import { getTranslations } from 'next-intl/server'

import { auth } from '@/auth'
import { UserStatistics } from '@/components/features/Statistics/UserStatistics'
import { getMoodStatistics, getPsyTestsStatistics } from '@/requests/userStatistics'

export default async function MyProgressStatisticsPage() {
  const session = await auth()
  const t = await getTranslations('components.UserStatistics')

  const [moodRes, psyRes] = await Promise.all([getMoodStatistics(session), getPsyTestsStatistics(session)])

  const mood = 'data' in moodRes ? moodRes.data : null
  const psyTests = 'data' in psyRes ? psyRes.data : null

  if (!mood) {
    return (
      <div className="flex items-center justify-center py-16">
        <span className="text-textcolor-secondary">{t('error')}</span>
      </div>
    )
  }

  return <UserStatistics mood={mood} psyTests={psyTests} />
}
