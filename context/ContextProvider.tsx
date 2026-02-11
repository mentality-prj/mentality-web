import { ComponentType, ReactNode } from 'react'

import { SORT_ORDER } from '@/types/sort'

import { SavedFilterProvider } from './savedFilterContext'

type ProviderConfig<TProps = unknown> = {
  Component: ComponentType<TProps & { children: ReactNode }>
  props: TProps
}

/**
 * Helper function to create type-safe provider configurations.
 * Ensures that props match the Component's expected prop types.
 */
function createProviderConfig<TProps>(
  Component: ComponentType<TProps & { children: ReactNode }>,
  props: TProps
): ProviderConfig<TProps> {
  return { Component, props }
}

const providers = [
  createProviderConfig(SavedFilterProvider, {
    initial: { order: SORT_ORDER.NEWEST, categories: '' as const },
  }),
] as const

export const ContextProvider = ({ children }: { children: ReactNode }) =>
  providers.reduceRight((acc, { Component, props }) => {
    return <Component {...props}>{acc}</Component>
  }, children)
