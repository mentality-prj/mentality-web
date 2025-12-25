import { AdminComponents } from '@/components/Admin'

import CardContainer from '../../../../components/Cards/CardContainer'

export default function AdminExercisesPage() {
  // Admin exercises content (from Tabs)
  return (
    <CardContainer>
      <AdminComponents.EXERCISES />
    </CardContainer>
  )
}
