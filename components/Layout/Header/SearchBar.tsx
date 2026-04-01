'use client'
import { useState } from 'react'
import { X } from 'lucide-react'
import { useTranslations } from 'next-intl'

import { CustomInput } from '@/ds/components/CustomInput'

const SearchBar = () => {
  const t = useTranslations('components.Header.SearchBar')
  const [query, setQuery] = useState('')

  return (
    <CustomInput
      id="search"
      placeholder={t('placeholder')}
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      rightIcon={query ? <X size={16} /> : undefined}
      onRightClick={() => setQuery('')}
      className="placeholder-textcolor-tertiary h-8 border-none bg-background caret-textcolor-primary hover:bg-background-soft focus:placeholder-transparent focus-visible:bg-background-soft"
    />
  )
}

export default SearchBar
