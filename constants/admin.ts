export const AdminRoutesTitles = Object.freeze({
  TAGS: 'Tags',
  TIPS: 'Tips',
})

export type AdminRoutesTitlesKeyType = keyof typeof AdminRoutesTitles

export const adminMenu: ReadonlyArray<AdminRoutesTitlesKeyType> = Object.keys(
  AdminRoutesTitles
) as ReadonlyArray<AdminRoutesTitlesKeyType>
