import Card from '@/components/Cards/Card'
import { AddIcon } from '@/ds/icons/add'

type CreatePersonalGoalButtonProps = {
  text: string
  onClick: () => void
}

export const CreatePersonalGoalButton = ({ text, onClick }: CreatePersonalGoalButtonProps) => {
  return (
    <Card
      onClick={onClick}
      className="ring-outline-secondary group flex h-full min-h-40 flex-col items-center justify-center gap-sm rounded-md p-6 ring-1 ring-inset hover:cursor-pointer hover:ring-2 hover:ring-primary-hover"
    >
      <div className="text-primary group-hover:text-primary-hover">
        <AddIcon />
      </div>
      <span className="bg-secondary-hover group-hover:bg-secondary-pressed whitespace-nowrap rounded-sm px-3 py-2 font-semibold text-primary group-hover:text-primary-hover">
        {text}
      </span>
    </Card>
  )
}

export default CreatePersonalGoalButton
