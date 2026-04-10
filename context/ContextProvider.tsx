import { ReactNode } from 'react'

import { SORT_ORDER } from '@/types/sort'

import { FavoritesProvider } from './favoritesContext'
import { SavedFilterProvider } from './savedFilterContext'

type ProviderWrap = (children: ReactNode) => ReactNode

const providers: ProviderWrap[] = [
  (children) => (
    <SavedFilterProvider initial={{ order: SORT_ORDER.NEWEST, categories: '' as const }}>
      {children}
    </SavedFilterProvider>
  ),
  (children) => <FavoritesProvider>{children}</FavoritesProvider>,
]

export const ContextProvider = ({ children }: { children: ReactNode }) =>
  providers.reduceRight((acc, wrap) => wrap(acc), children)
