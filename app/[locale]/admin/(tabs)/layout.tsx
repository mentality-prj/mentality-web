import AdminInnerMenu from '@/components/features/Admin/AdminInnerMenu/AdminInnerMenu'

export default function AdminTabsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-md">
      <AdminInnerMenu />
      {children}
    </div>
  )
}
