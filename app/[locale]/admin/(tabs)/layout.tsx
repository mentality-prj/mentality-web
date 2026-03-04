import AdminInnerMenu from '@/components/features/Admin/AdminInnerMenu/AdminInnerMenu'
import AdminMobileNavDrawer from '@/components/Layout/MobileNavDrawer/AdminMobileNavDrawer'

export default function AdminTabsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-md">
      <div className="mt-4 flex items-start justify-between gap-2">
        <AdminInnerMenu />
        <div className="md:hidden">
          <AdminMobileNavDrawer />
        </div>
      </div>
      {children}
    </div>
  )
}
