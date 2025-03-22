import { Avatar, Tooltip } from '@nextui-org/react'
import { usePathname } from 'next/navigation'

import { AccountsIcon } from '../icons/sidebar/accounts-icon'
import { BalanceIcon } from '../icons/sidebar/balance-icon'
import { ChangeLogIcon } from '../icons/sidebar/changelog-icon'
import { CustomersIcon } from '../icons/sidebar/customers-icon'
import { DevIcon } from '../icons/sidebar/dev-icon'
import { FilterIcon } from '../icons/sidebar/filter-icon'
import { HomeIcon } from '../icons/sidebar/home-icon'
import { PaymentsIcon } from '../icons/sidebar/payments-icon'
import { ProductsIcon } from '../icons/sidebar/products-icon'
import { ReportsIcon } from '../icons/sidebar/reports-icon'
import { SettingsIcon } from '../icons/sidebar/settings-icon'
import { ViewIcon } from '../icons/sidebar/view-icon'
import { useSidebarContext } from '../layout/layout-context'

import { CollapseItems } from './collapse-items'
import { CompaniesDropdown } from './companies-dropdown'
import { Sidebar } from './sidebar.styles'
import { SidebarItem } from './sidebar-item'
import { SidebarMenu } from './sidebar-menu'

export const SidebarWrapper = () => {
  const pathname = usePathname()
  const { collapsed, setCollapsed } = useSidebarContext()

  return (
    <aside className="sticky top-0 z-[20] h-screen">
      {collapsed ? (
        <div role="button" tabIndex={0} className={Sidebar.Overlay()} onClick={setCollapsed} onKeyDown={setCollapsed} />
      ) : null}
      <div
        className={Sidebar({
          collapsed: collapsed,
        })}
      >
        <div className={Sidebar.Header()}>
          <CompaniesDropdown />
        </div>
        <div className="flex h-full flex-col justify-between">
          <div className={Sidebar.Body()}>
            <SidebarItem title="Home" icon={<HomeIcon />} isActive={pathname === '/'} href="/" />
            <SidebarMenu title="Main Menu">
              <SidebarItem
                isActive={pathname === '/accounts'}
                title="Accounts"
                icon={<AccountsIcon />}
                href="accounts"
              />
              <SidebarItem isActive={pathname === '/payments'} title="Payments" icon={<PaymentsIcon />} />
              <CollapseItems
                icon={<BalanceIcon />}
                items={['Banks Accounts', 'Credit Cards', 'Loans']}
                title="Balances"
              />
              <SidebarItem isActive={pathname === '/customers'} title="Customers" icon={<CustomersIcon />} />
              <SidebarItem isActive={pathname === '/products'} title="Products" icon={<ProductsIcon />} />
              <SidebarItem isActive={pathname === '/reports'} title="Reports" icon={<ReportsIcon />} />
            </SidebarMenu>

            <SidebarMenu title="General">
              <SidebarItem isActive={pathname === '/developers'} title="Developers" icon={<DevIcon />} />
              <SidebarItem isActive={pathname === '/view'} title="View Test Data" icon={<ViewIcon />} />
              <SidebarItem isActive={pathname === '/settings'} title="Settings" icon={<SettingsIcon />} />
            </SidebarMenu>

            <SidebarMenu title="Updates">
              <SidebarItem isActive={pathname === '/changelog'} title="Changelog" icon={<ChangeLogIcon />} />
            </SidebarMenu>
          </div>
          <div className={Sidebar.Footer()}>
            <Tooltip content={'Settings'} color="primary">
              <div className="max-w-fit">
                <SettingsIcon />
              </div>
            </Tooltip>
            <Tooltip content={'Adjustments'} color="primary">
              <div className="max-w-fit">
                <FilterIcon />
              </div>
            </Tooltip>
            <Tooltip content={'Profile'} color="primary">
              <Avatar src="https://i.pravatar.cc/150?u=a042581f4e29026704d" size="sm" />
            </Tooltip>
          </div>
        </div>
      </div>
    </aside>
  )
}
