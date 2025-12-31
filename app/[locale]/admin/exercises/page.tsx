import { AdminComponents } from '@/components/Admin'

import CardContainer from '../../../../components/Cards/CardContainer'

export default function AdminExercisesPage() {
  // Admin exercises content (from Tabs)
  return (
    <div className="container-max-width relative z-10 flex min-h-screen w-full">
      <CardContainer>
        <AdminComponents.EXERCISES />
      </CardContainer>
    </div>
  )
}
