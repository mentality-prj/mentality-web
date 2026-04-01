import { auth } from '@/auth'
import { AdminGroupTree } from '@/components/features/Company/GlobalAdmin/AdminGroupTree/AdminGroupTree'
import { adminGetGroups } from '@/requests/companyAdmin'
import { CustomSession } from '@/types/auth'

export default async function AdminCompanyGroupsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const session = await auth()
  const result = await adminGetGroups(session as CustomSession, id)
  const initialGroups = 'error' in result ? undefined : result.data

  return <AdminGroupTree companyId={id} initialGroups={initialGroups} />
}
