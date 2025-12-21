import { AdminComponents } from '@/components/Admin'
import { Card, CardContent } from '@/ds/shadcn/card'

export default function AdminTagsPage() {
  // Admin tags content (from Tabs)
  return (
    <Card>
      <CardContent className="w-full">
        <AdminComponents.TAGS />
      </CardContent>
    </Card>
  )
}
