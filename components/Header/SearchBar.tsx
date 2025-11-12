import { Mic, Search } from 'lucide-react'
import { useTranslations } from 'next-intl'

import { CustomInput } from '@/ds/components/CustomInput'

export const SearchBar = () => {
  const t = useTranslations('Header.SearchBar')
  return (
    <CustomInput
      placeholder={t('placeholder')}
      leftIcon={<Search className="h-5 w-5 text-iconcolor-secondary tablet:h-6 tablet:w-6" />}
      rightIcon={<Mic className="h-5 w-5 text-iconcolor-secondary tablet:h-6 tablet:w-6" />}
    />
  )
}
