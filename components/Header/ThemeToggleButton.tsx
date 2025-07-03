import { Button } from 'ds/shadcn/button'
import { Moon } from 'lucide-react'

export const ThemeToggleButton = () => {
  return (
    <Button variant={'iconButton'} size={'icon'}>
      <Moon />
    </Button>
  )
}
