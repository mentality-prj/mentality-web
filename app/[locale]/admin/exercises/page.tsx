import { AdminComponents } from '@/components/Admin'
import { Card, CardContent } from '@/ds/shadcn/card'

export default function AdminExercisesPage() {
  // Admin exercises content (from Tabs)
  return (
    <Card>
      <CardContent className="w-full">
        <AdminComponents.EXERCISES />
      </CardContent>
    </Card>
  )
}
