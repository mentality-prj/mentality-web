import TopMenu from '../TopMenu/TopMenu'

import AddAffirmation from './AddAffirmation'
import AddExercise from './AddExercise'
import AddTag from './AddTag'
import AddTip from './AddTip'
import AdminHeader from './AdminHeader'

export const AdminComponents = {
  AFFIRMATIONS: AddAffirmation,
  TAGS: AddTag,
  TIPS: AddTip,
  EXERCISES: AddExercise,
}

export { AdminHeader, TopMenu }
