'use client'
import { Search } from 'lucide-react'
import { useTranslations } from 'next-intl'

import { CustomInput } from '@/ds/components/CustomInput'

const SearchBar = () => {
  const t = useTranslations('components.Header.SearchBar')

  const handleSearch = () => console.log('click Search')

  return (
    <CustomInput
      id="search"
      placeholder={t('placeholder')}
      rightIcon={<Search size={16} color="var(--remark)" />}
      onRightClick={handleSearch}
      onClick={handleSearch}
      className="border-none"
    />
  )
}

export default SearchBar
