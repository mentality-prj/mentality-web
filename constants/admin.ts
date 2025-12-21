export const AdminRoutesTitles = Object.freeze({
  TAGS: 'tabs.tags',
  TIPS: 'tabs.tips',
  EXERCISES: 'tabs.exercises',
})

export type AdminRoutesTitlesKeyType = keyof typeof AdminRoutesTitles

export const adminMenu = ['TAGS', 'TIPS', 'EXERCISES'] as const

export type AdminMenuType = (typeof adminMenu)[number]
