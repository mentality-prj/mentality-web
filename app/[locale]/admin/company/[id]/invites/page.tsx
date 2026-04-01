import { AdminInviteFormModal } from '@/components/features/Company/GlobalAdmin/AdminInviteFormModal/AdminInviteFormModal'
import { AdminInviteList } from '@/components/features/Company/GlobalAdmin/AdminInviteList/AdminInviteList'

export default async function AdminCompanyInvitesPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  return (
    <div className="flex flex-col gap-md">
      <div className="flex justify-end">
        <AdminInviteFormModal companyId={id} />
      </div>
      <AdminInviteList companyId={id} />
    </div>
  )
}
