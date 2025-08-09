import { createContext, Dispatch, SetStateAction } from 'react'

export interface SortContextType {
  sort: string
  setSort: Dispatch<SetStateAction<string>>
}

export interface FilterContextType {
  filter: string
  setFilter: Dispatch<SetStateAction<string>>
}

export const SortContext = createContext<SortContextType>({
  sort: 'newest',
  setSort: () => {},
})

export const FilterContext = createContext<FilterContextType>({
  filter: '',
  setFilter: () => {},
})
