import { transformToRoutes } from '@/helpers/gloabal'
import { RoutesType } from '@/types/routes'

export const RoutesTitles = Object.freeze({
  ADMIN: 'Admin',
  ADMIN_DIP: 'Admin/DIP',
  ADMIN_R_AND_D: 'Admin/R-And-D',
  ADMIN_R_AND_D_DIAGNOSTICS: 'Admin/R-And-D/Diagnostics',
  RESEARCH: 'Research',
  RESEARCH_PROJECTS: 'Research/Projects',
  RESEARCH_PROJECTS_CREATE: 'Research/Projects/Create',
  ABOUT: 'About',
  SERVICES: 'Services',
  FAQ: 'Faq',
  CONTACTS: 'Contacts',
  AFFIRMATIONS: 'Affirmations',
  ARTICLES: 'Articles',
  DIARY: 'Diary',
  GUIDE: 'Guide',
  MEDITATIONS: 'Guide/Meditations',
  GUIDETIPS: 'Guide/Tips',
  MYDAY: 'My-day',
  MOODTRACKER: 'Mood-Tracker',
  MYSPACE: 'My-Space',
  MYPROGRESS: 'My-Progress',
  MYPROGRESSGOALS: 'My-Progress/Goals',
  MYPROGRESSSTATISTICS: 'My-Progress/Statistics',
  MENTAL_GAMES: 'Mental-Games',
  PSYCHOLOGICALTESTS: 'Psychological-Tests',
  MENTAL_CHECK: 'Psychological-Tests/mental-check',
  ANXIETY_CHECK: 'Psychological-Tests/anxiety-check',
  WELL_BEING_CHECK: 'Psychological-Tests/well-being-check',
  PROFILE: 'Profile',
  SETTINGS: 'Settings',
  AUTH: 'Auth',
  TIPS: 'Tips',
  ATTENTION_SPRINT: 'Mental-Games/Attention-Sprint',
  SERVERERROR: 'Server-Error',
  PRIVACY: 'Privacy',
  TERMS: 'Terms',
  COOKIES: 'Cookies',
  COMPANY: 'Company',
  COMPANY_GLOBAL_ADMIN: 'Admin/Company',
  COMPANY_ADMIN: 'Company/Admin',
  COMPANY_ADMIN_EMPLOYEES: 'Company/Admin/Employees',
  COMPANY_ADMIN_INVITES: 'Company/Admin/Invites',
  COMPANY_ADMIN_GROUPS: 'Company/Admin/Groups',
  COMPANY_ADMIN_ACCESS_SCOPES: 'Company/Admin/Access-Scopes',
  COMPANY_MANAGER: 'Company/Manager',
  COMPANY_MANAGER_EMPLOYEES: 'Company/Manager/Employees',
  COMPANY_MANAGER_INVITES: 'Company/Manager/Invites',
  COMPANY_MANAGER_ANALYTICS: 'Company/Manager/Analytics',
  COMPANY_MANAGER_DECISION_SUPPORT: 'Company/Manager/Decision-Support',
})

export const Routes = Object.freeze({
  ...transformToRoutes(RoutesTitles),
  MAIN: '/',
  meditationDetail: (id: string) => `/guide/meditations/${id}`,
  adminCompanyDetail: (id: string) => `/admin/company/${id}`,
  adminCompanyGroups: (id: string) => `/admin/company/${id}/groups`,
  adminCompanyEmployees: (id: string) => `/admin/company/${id}/employees`,
  adminCompanyInvites: (id: string) => `/admin/company/${id}/invites`,
  researchProject: (projectId: string) => `/research/projects/${projectId}`,
  researchProjectDashboard: (projectId: string) => `/research/projects/${projectId}/dashboard`,
  researchProjectDiagnostics: (projectId: string) => `/research/projects/${projectId}/diagnostics`,
  researchProjectCohort: (projectId: string) => `/research/projects/${projectId}/cohort`,
  researchProjectGrants: (projectId: string) => `/research/projects/${projectId}/grants`,
  researchProjectDatasets: (projectId: string) => `/research/projects/${projectId}/datasets`,
  researchProjectExports: (projectId: string) => `/research/projects/${projectId}/exports`,
  researchProjectAudit: (projectId: string) => `/research/projects/${projectId}/audit`,
  researchProjectMembers: (projectId: string) => `/research/projects/${projectId}/members`,
}) as RoutesType & {
  readonly meditationDetail: (id: string) => string
  readonly adminCompanyDetail: (id: string) => string
  readonly adminCompanyGroups: (id: string) => string
  readonly adminCompanyEmployees: (id: string) => string
  readonly adminCompanyInvites: (id: string) => string
  readonly researchProject: (projectId: string) => string
  readonly researchProjectDashboard: (projectId: string) => string
  readonly researchProjectDiagnostics: (projectId: string) => string
  readonly researchProjectCohort: (projectId: string) => string
  readonly researchProjectGrants: (projectId: string) => string
  readonly researchProjectDatasets: (projectId: string) => string
  readonly researchProjectExports: (projectId: string) => string
  readonly researchProjectAudit: (projectId: string) => string
  readonly researchProjectMembers: (projectId: string) => string
}
