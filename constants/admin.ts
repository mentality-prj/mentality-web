export const AdminRoutesTitles = Object.freeze({
  TAGS: 'tabs.tags',
  TIPS: 'tabs.tips',
  EXERCISES: 'tabs.exercises',
})

export type AdminRoutesTitlesKeyType = keyof typeof AdminRoutesTitles

export const adminMenu: ReadonlyArray<AdminRoutesTitlesKeyType> = ['TAGS', 'TIPS', 'EXERCISES'] as const
