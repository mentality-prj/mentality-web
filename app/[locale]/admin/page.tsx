'use client'

import { AdminComponents } from '@/components/Admin'
import { adminMenu, AdminRoutesTitlesKeyType } from '@/constants/admin'
import { Card, CardContent } from '@/ds/shadcn/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/ds/shadcn/tabs'

export default function AdminPage() {
  const adminMenuMap = adminMenu.map((item: AdminRoutesTitlesKeyType) => {
    const Component = AdminComponents[`${item}`]
    return (
      <TabsContent key={item} value={item}>
        <Card>
          <CardContent className="w-full">
            <Component />
          </CardContent>
        </Card>
      </TabsContent>
    )
  })
  return (
    <Tabs aria-label="Admin Panel" color="secondary">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="TAGS">Tags</TabsTrigger>
        <TabsTrigger value="TIPS">Tips</TabsTrigger>
      </TabsList>
      {adminMenuMap}
    </Tabs>
  )
}
