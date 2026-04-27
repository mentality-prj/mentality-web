'use client'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Search, X } from 'lucide-react'
import { useTranslations } from 'next-intl'

import { searchItems } from '@/constants/searchItems'
import { CustomInput } from '@/ds/components/CustomInput'
import { Link, useRouter } from '@/i18n/navigation'
import { cn } from '@/lib/utils'

const SearchBar = ({
  isMobileOpen,
  setIsMobileOpen,
}: {
  isMobileOpen: boolean
  setIsMobileOpen: (open: boolean) => void
}) => {
  const t = useTranslations('components.Header.SearchBar')
  const tMenu = useTranslations('common.menu')
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)
  const containerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const filteredItems = useMemo(() => {
    if (!query.trim()) return []
    const normalizedQuery = query.trim().toLowerCase()
    return searchItems.filter((item) => {
      const label = tMenu(item.key).toLowerCase()
      return label.includes(normalizedQuery)
    })
  }, [query, tMenu])

  const clearSearch = useCallback(() => {
    setQuery('')
    setIsOpen(false)
    setActiveIndex(-1)
  }, [])

  const navigateTo = useCallback(
    (href: string) => {
      clearSearch()
      inputRef.current?.blur()
      router.push(href)
      setIsMobileOpen(false)
    },
    [clearSearch, router, setIsMobileOpen]
  )

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!isOpen || filteredItems.length === 0) {
        if (e.key === 'Escape') {
          clearSearch()
          inputRef.current?.blur()
        }
        return
      }

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault()
          setActiveIndex((prev) => (prev < filteredItems.length - 1 ? prev + 1 : 0))
          break
        case 'ArrowUp':
          e.preventDefault()
          setActiveIndex((prev) => (prev > 0 ? prev - 1 : filteredItems.length - 1))
          break
        case 'Enter':
          e.preventDefault()
          if (activeIndex >= 0) {
            const selectedItem = filteredItems.at(activeIndex)
            if (selectedItem) {
              navigateTo(selectedItem.href)
            }
          }
          break
        case 'Escape':
          clearSearch()
          inputRef.current?.blur()
          break
      }
    },
    [isOpen, filteredItems, activeIndex, clearSearch, navigateTo]
  )

  useEffect(() => {
    setIsOpen(query.trim().length > 0)
    setActiveIndex(-1)
  }, [query])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false)
        setIsMobileOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [setIsMobileOpen])

  return (
    <div ref={containerRef} className="flex items-center tablet:relative">
      <button
        type="button"
        aria-label={t('placeholder')}
        className={cn('sm:hidden', isMobileOpen && 'hidden')}
        onClick={() => setIsMobileOpen(true)}
      >
        <Search size={18} />
      </button>

      <div
        className={cn(isMobileOpen ? 'absolute left-4 right-4 top-14 z-50 flex' : 'hidden sm:block', 'tablet:static')}
      >
        <CustomInput
          ref={inputRef}
          id="search"
          placeholder={t('placeholder')}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.trim() && setIsOpen(true)}
          onKeyDown={handleKeyDown}
          rightIcon={query ? <X size={16} /> : undefined}
          onRightClick={clearSearch}
          role="combobox"
          aria-expanded={isOpen}
          aria-autocomplete="list"
          aria-controls="search-results"
          aria-activedescendant={isOpen && activeIndex >= 0 ? `search-option-${activeIndex}` : undefined}
          className="placeholder-textcolor-tertiary h-8 border-none bg-background caret-textcolor-primary hover:bg-background-soft focus:placeholder-transparent focus-visible:bg-background-soft"
          containerClassName="w-full"
        />
        {isOpen && (
          <ul
            id="search-results"
            role="listbox"
            className="absolute top-full z-50 mt-1 max-h-64 w-full overflow-y-auto rounded-md border bg-white shadow-lg"
          >
            {filteredItems.length > 0 ? (
              filteredItems.map((item, index) => (
                <li key={item.key} id={`search-option-${index}`} role="option" aria-selected={index === activeIndex}>
                  <Link
                    href={item.href}
                    onClick={() => {
                      clearSearch()
                      setIsMobileOpen(false)
                    }}
                    className={`block px-3 py-2 text-sm ${
                      index === activeIndex
                        ? 'bg-background-soft text-textcolor-primary'
                        : 'text-textcolor-secondary hover:bg-background-soft'
                    }`}
                  >
                    {tMenu(item.key)}
                  </Link>
                </li>
              ))
            ) : (
              <li
                role="option"
                aria-selected={false}
                aria-disabled={true}
                className="text-textcolor-tertiary px-3 py-2 text-sm"
              >
                {t('noResults')}
              </li>
            )}
          </ul>
        )}
      </div>
    </div>
  )
}

export default SearchBar
