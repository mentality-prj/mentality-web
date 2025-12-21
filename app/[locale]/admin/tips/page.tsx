import { AdminComponents } from '@/components/Admin'
import { Card, CardContent } from '@/ds/shadcn/card'

export default function AdminTipsPage() {
  // Admin tips content (from Tabs)
  return (
    <Card>
      <CardContent className="w-full">
        <AdminComponents.TIPS />
      </CardContent>
    </Card>
  )
}
