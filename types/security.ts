import { Roles } from '@/constants/security'

export type RoleKey = keyof typeof Roles
export type RoleType = (typeof Roles)[RoleKey]
