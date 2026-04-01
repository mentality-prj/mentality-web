import { AdminEmployeeTable } from '@/components/features/Company/GlobalAdmin/AdminEmployeeTable/AdminEmployeeTable'

export default async function AdminCompanyEmployeesPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  return <AdminEmployeeTable companyId={id} />
}
