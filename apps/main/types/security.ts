export const Roles = Object.freeze({ ADMIN: 'admin', USER: 'user' })

export type RoleKey = keyof typeof Roles
export type RoleType = (typeof Roles)[RoleKey]
