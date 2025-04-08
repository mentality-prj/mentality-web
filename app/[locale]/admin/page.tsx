'use client'
import { Tab, Tabs } from '@nextui-org/react'

import { AdminComponents } from '@/components/Admin'
import { adminMenu, AdminRoutesTitles, AdminRoutesTitlesKeyType } from '@/constants/admin'
import { Card, CardContent } from '@/ds/shadcn/card'

export default function AdminPage() {
  const adminMenuMap = adminMenu.map((item: AdminRoutesTitlesKeyType) => {
    const Component = AdminComponents[`${item}`]
    return (
      <Tab key={item} title={AdminRoutesTitles[`${item}`]}>
        <Card>
          <CardContent className="w-full">
            <Component />
          </CardContent>
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
