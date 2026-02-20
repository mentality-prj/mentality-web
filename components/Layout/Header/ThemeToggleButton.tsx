import { Moon } from 'lucide-react'

import { Button } from '@/ui/button'

export const ThemeToggleButton = () => {
  return (
    <Button variant="iconButton" className="h-6 w-6 rounded-full p-0 tablet:h-8 tablet:w-8">
      <Moon className="h-5 w-5 tablet:h-6 tablet:w-6" />
    </Button>
  )
}
