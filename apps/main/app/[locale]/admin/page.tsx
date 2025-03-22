'use client'
import { Card, CardBody, Tab, Tabs } from '@nextui-org/react'

import { AdminComponents } from '@/components/Admin'
import { adminMenu, AdminRoutesTitles, AdminRoutesTitlesKeyType } from '@/constants/admin'

export default function AdminPage() {
  const adminMenuMap = adminMenu.map((item: AdminRoutesTitlesKeyType) => {
    const Component = AdminComponents[`${item}`]
    return (
      <Tab key={item} title={AdminRoutesTitles[`${item}`]}>
        <Card>
          <CardBody className="w-full">
            <Component />
          </CardBody>
        </Card>
      </Tab>
    )
  })
  return (
    <Tabs aria-label="Admin Panel" color="secondary">
      {adminMenuMap}
    </Tabs>
  )
}
