import AdminInnerMenu from '@/components/features/Admin/AdminInnerMenu/AdminInnerMenu'

/**
 * AdminLayout owns the mobile navigation drawer.
 * Do not render a second drawer on nested admin pages.
 */
export default function AdminTabsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-md">
      <div className="mt-4 flex items-start">
        <AdminInnerMenu />
      </div>
      {children}
    </div>
  )
}
