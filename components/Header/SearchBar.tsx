import { Mic, Search } from 'lucide-react'

import { CustomInput } from '@/ds/components/CustomInput'

export const SearchBar = () => {
  return (
    <CustomInput
      leftIcon={<Search className="h-6 w-6 text-iconcolor-secondary" />}
      rightIcon={<Mic className="h-6 w-6 text-iconcolor-secondary" />}
    />
  )
}
