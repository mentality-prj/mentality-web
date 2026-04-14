import { AdminGroupTree } from '@/components/features/Company/GlobalAdmin/AdminGroupTree/AdminGroupTree'
import { getServerSession } from '@/lib/get-server-session'
import { adminGetGroups } from '@/requests/companyAdmin'
import { CustomSession } from '@/types/auth'

export default async function AdminCompanyGroupsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const session = await getServerSession()
  const result = await adminGetGroups(session as CustomSession, id)
  const initialGroups = 'error' in result ? undefined : result.data

  return <AdminGroupTree companyId={id} initialGroups={initialGroups} />
}
