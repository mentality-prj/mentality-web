'use client'

import { useTranslations } from 'next-intl'

import { AdminComponents } from '@/components/Admin'
import { adminMenu, AdminRoutesTitles, AdminRoutesTitlesKeyType } from '@/constants/admin'
import { Card, CardContent } from '@/ds/shadcn/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/ds/shadcn/tabs'

export default function AdminPage() {
  const t = useTranslations('components.Admin')
  const adminMenuMap = adminMenu.map((item: AdminRoutesTitlesKeyType) => {
    const Component = AdminComponents[item as AdminRoutesTitlesKeyType]
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
    <Tabs aria-label="Admin Panel" color="secondary" defaultValue="TAGS">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="TAGS">{t(AdminRoutesTitles.TAGS)}</TabsTrigger>
        <TabsTrigger value="TIPS">{t(AdminRoutesTitles.TIPS)}</TabsTrigger>
        <TabsTrigger value="EXERCISES">{t(AdminRoutesTitles.EXERCISES)}</TabsTrigger>
      </TabsList>
      {adminMenuMap}
    </Tabs>
  )
}
