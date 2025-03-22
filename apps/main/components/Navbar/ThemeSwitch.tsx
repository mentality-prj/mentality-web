import { Switch } from '@nextui-org/react'
import { useTheme as useNextTheme } from 'next-themes'

import { MoonIcon } from '@/components/icons/navbar/moon-icon'
import { SunIcon } from '@/components/icons/navbar/sun-icon'

export default function ThemeSwitch() {
  const { setTheme, resolvedTheme } = useNextTheme()
  return (
    <Switch
      isSelected={resolvedTheme === 'light' ? true : false}
      thumbIcon={({ isSelected, className }) =>
        isSelected ? <SunIcon className={className} /> : <MoonIcon className={className} />
      }
      onValueChange={(e) => setTheme(e ? 'light' : 'dark')}
    />
  )
}
