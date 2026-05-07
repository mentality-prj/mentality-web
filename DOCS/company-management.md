# Company Management — Developer & Admin Guide

Generated: 2026-01-17

---

## Overview

The Company Management feature adds multi-tenant B2B support to Dzvin.co Web.
It introduces three **company roles** layered on top of the existing system `admin`/`user` roles, a group hierarchy, employee invites, access scopes for managers, and an analytics dashboard.

The system `admin` role (`session.user.role`) is used for platform-level actions (creating companies). Company-level roles (`session.user.companyRole`) govern everything inside a company.

---

## Role Hierarchy

| Role           | Constant                        | Who is it                                                     |
| -------------- | ------------------------------- | ------------------------------------------------------------- |
| system `admin` | `session.user.role === 'admin'` | Platform admin — creates companies via `/admin/company`       |
| `SUPERUSER`    | `COMPANY_ROLES.SUPERUSER`       | Company owner — manages their own company, groups, employees  |
| `MANAGER`      | `COMPANY_ROLES.MANAGER`         | Team lead — invites employees to the groups assigned by Admin |
| `EMPLOYEE`     | `COMPANY_ROLES.EMPLOYEE`        | End user — receives an invite and joins the platform          |

The company role is stored on `session.user.companyRole` (see `types/next-auth.d.ts`).
Permission arrays are defined in `types/rbac.ts`:

```ts
CAN_MANAGE_GROUPS = [SUPERUSER]
CAN_INVITE_EMPLOYEES = [SUPERUSER, MANAGER]
CAN_ASSIGN_MANAGERS = [SUPERUSER]
CAN_VIEW_ANALYTICS = [SUPERUSER, MANAGER]
```

Company creation is guarded by the system `admin` role, not by a company role.

---

## URL Structure

All company pages live under `app/[locale]/company/`:

| Path               | Accessible by                                                                     |
| ------------------ | --------------------------------------------------------------------------------- |
| `/company`         | Any authenticated user with a `companyRole` or system `admin` (redirects by role) |
| `/admin/company`   | System `admin` only (`session.user.role === 'admin'`)                             |
| `/company/admin`   | `SUPERUSER` only                                                                  |
| `/company/manager` | `MANAGER` only                                                                    |

The shared layout (`app/[locale]/company/layout.tsx`) performs server-side guards:

1. Unauthenticated → redirect to `/signin`
2. System `admin` → allowed through (even without `companyRole`)
3. No valid `companyRole` on session → redirect to `/`

The index page (`/company`) then redirects the user to their role-specific panel automatically.

---

## Panel Breakdown

### Global Admin — `/admin/company`

**Who:** Platform admin only (system role `admin`, i.e. `session.user.role === 'admin'`).

**What it does:**

- **Create a Company** — form with a company name field; calls `POST /companies`; on success a new `CompanyEntity` is created.

**Components:** `GlobalAdmin/CreateCompanyForm`

---

### Company Admin — `/company/admin`

**Who:** Company owner (`SUPERUSER`).

The page is split into five sections:

#### 1. Manage Groups

Groups are organised as a **tree** (parent ↔ children). Each group node supports:

- **Inline edit** — click the edit icon, change name, press Enter or click Save.
- **Add child group** — click the `+` icon on a node to add a sub-group.
- **Delete** — available only on leaf nodes (no children); calls `DELETE /groups/:id`.

The root-level **"Add Group"** button creates a top-level group under the company.

Components: `CompanyAdmin/ManageGroups/GroupTree`, `GroupTreeNode`
Requests: `createGroup`, `updateGroup`, `deleteGroup` from `requests/groups.ts`

#### 2. Employee List

A **paginated table** of current employees. Columns: full name, email, role, groups, joined date.

Pagination is handled inside the `EmployeeTable` component using local state; it calls `getEmployees` with the current page when the "Previous / Next" buttons are used.

Components: `CompanyAdmin/EmployeeList/EmployeeTable`
Requests: `GET /employees?page={page}&limit={limit}`

#### 3. Invite Employee

Send an email invitation to a new employee.

- **Email** — validated (must be a valid address).
- **Role** — `EMPLOYEE` or `MANAGER`.
- **Groups** — multi-select tree picker; at least one group required.

An invite is created with `POST /invites`; its initial status is `pending`.

Components: `CompanyAdmin/InviteEmployee/InviteEmployeeForm`

#### 4. Pending Invites

Shared table showing all outstanding invites (status: `pending | accepted | expired`).

Actions per row:

- **Resend** — available for `pending` and `expired` invites; calls `POST /invites/:id/resend`.
- **Cancel** — available for `pending` invites only; calls `DELETE /invites/:id`.

After each action the row is optimistically removed/updated in the UI.

Components: `InviteList/InviteList`
Hook: `useInvites(page)`

#### 5. Assign Manager Access

Grant a Manager access to specific groups and optionally allow analytics access.

- Select a Manager from the employee list (filtered to `MANAGER` role).
- Pick the groups the Manager can see (tree multi-select).
- Toggle **Allow Analytics** to let the manager view mood analytics for their groups.
- Click **Save** → creates `AccessScopeEntity` records via `POST /access-scopes`.
- Existing scopes are listed below with a **Revoke** button per record.

Components: `CompanyAdmin/AssignManager/AssignManagerForm`
Requests: `createAccessScope`, `deleteAccessScope`, `getAccessScopes`

---

### Manager — `/company/manager`

**Who:** Team lead (`MANAGER`).

The page contains three sections:

#### 1. Invite Employee

Same flow as the Admin invite form, but:

- Role is fixed to **EMPLOYEE only** (Managers cannot invite other Managers).
- The **Groups** picker shows all groups belonging to the Manager's company. Groups are loaded via `useGroups()` which resolves the company ID automatically using `GET /companies/my`.
- If the company has no groups, the form is disabled with an explanatory message.

Components: `Manager/InviteEmployeeManagerForm`

#### 2. Pending Invites

Same shared `InviteList` table as above, filtered to invites created by this Manager.

#### 3. Analytics

A **dashboard** (Recharts `LineChart`) showing mood, stress, energy, and focus metrics over time. Consists of:

- **Summary cards** — total employees, active employees, total check-ins, and average scores.
- **Risk distribution** — low / medium / high risk employee counts as coloured badges.
- **Trend chart** — line chart with four series (mood / stress / energy / focus) by month.
- **Groups table** — per-group breakdown with all metrics.

**Date range** — two date pickers (`from` / `to`). Maximum span is **1 year**; if the user selects a wider range, the form shows a validation error and the request is rejected until the range is corrected.

**Group filter** — multi-select tree; shows all groups of the company.

Analytics are fetched automatically on initial load and whenever `from`, `to`, or `groupIds` change, using `GET /companies/:companyId/analytics/mood?from=...&to=...&groupIds=...`.

The `companyId` is resolved automatically: for system admins it comes from `AdminCompanyContext`; for managers it is fetched via `GET /companies/my` before the analytics call.

Request functions: `requests/analytics.ts` — `getMoodAnalytics` (manager) and `getMoodAnalyticsAdmin` (system admin).

Hook: `hooks/useAnalytics.ts`

Components: `Manager/AnalyticsView`

**Analytics response shape:**

```ts
type AnalyticsResponse = {
  companyId: string
  from: string
  to: string
  totalEmployees: number
  activeEmployees: number
  totalCheckins: number
  avgMood: number
  avgStress: number
  avgEnergy: number
  avgFocus: number
  riskDistribution: { low: number; medium: number; high: number }
  groups: AnalyticsGroupResult[]
  trend: AnalyticsTrendPoint[]
}
```

Full types are in `types/company.ts`.

---

## Shared Components

### `GroupSelector`

`components/features/Company/GroupSelector/GroupSelector.tsx`

A recursive tree picker with search.

| Prop            | Type                      | Description                 |
| --------------- | ------------------------- | --------------------------- |
| `groups`        | `GroupEntity[]`           | Full group tree             |
| `selected`      | `string[]`                | IDs of selected groups      |
| `onChange`      | `(ids: string[]) => void` | Selection change handler    |
| `disabledIds?`  | `string[]`                | IDs that cannot be selected |
| `singleSelect?` | `boolean`                 | Constrain to one selection  |

Search filters nodes by name down the tree; selecting a parent node does not auto-select children — each node is individually toggled.

### `RoleGuard`

`components/features/Company/RoleGuard.tsx`

Client-side guard that conditionally renders children.

```tsx
<RoleGuard allowedRoles={[COMPANY_ROLES.SUPERUSER]}>
  <AdminOnlyWidget />
</RoleGuard>
```

| Prop           | Description                                               |
| -------------- | --------------------------------------------------------- |
| `allowedRoles` | Array of `CompanyRole` values that may see the content    |
| `fallback?`    | Optional element to render when the user lacks permission |

Internally calls `useRbac().can(allowedRoles)`. While the session is loading it renders nothing (avoids flash).

### `useRbac` Hook

`hooks/useRbac.ts`

```ts
const { role, can, isLoading } = useRbac()

// role    → CompanyRole | undefined
// can([COMPANY_ROLES.MANAGER]) → boolean
// isLoading → true while session is resolving
```

---

## Invite Lifecycle

```
created (pending)
   │
   ├─ user accepts link → accepted
   ├─ admin/manager resends → pending (refreshed expiry)
   └─ admin/manager cancels → deleted
         │
         └─ time passes → expired
                 │
                 └─ resend → pending again
```

The `InviteList` component shows the `status` badge per row and enables/disables Resend and Cancel accordingly.

---

## Group Tree — Data Shape

```ts
interface GroupEntity {
  id: string
  name: string
  children: GroupEntity[] // recursive
  parentId: string | null
}
```

`flattenGroups(groups)` in `mappers/group.mappers.ts` does a depth-first flatten — useful when you need a flat list of all group IDs (e.g. for access scope lookups).

---

## API Endpoints Reference

Defined in `constants/companyEndpoints.ts`:

| Constant                                      | Value                                   | Method(s)     |
| --------------------------------------------- | --------------------------------------- | ------------- |
| `COMPANY_ENDPOINTS.BASE`                      | `/companies`                            | GET, POST     |
| `COMPANY_ENDPOINTS.MY`                        | `/companies/my`                         | GET           |
| `COMPANY_ENDPOINTS.byId(id)`                  | `/companies/:id`                        | GET           |
| `GROUP_ENDPOINTS.byCompany(companyId)`        | `/groups?companyId=:companyId`          | GET           |
| `GROUP_ENDPOINTS.byId(id)`                    | `/groups/:id`                           | PATCH, DELETE |
| `COMPANY_ADMIN_ENDPOINTS.groups(companyId)`   | `/companies/:companyId/groups`          | GET, POST     |
| `COMPANY_ADMIN_ENDPOINTS.groupById(cId, gId)` | `/companies/:companyId/groups/:groupId` | PATCH, DELETE |
| `INVITE_ENDPOINTS.BASE`                       | `/invites`                              | GET, POST     |
| `INVITE_ENDPOINTS.resend(id)`                 | `/invites/:id/resend`                   | POST          |
| `ACCESS_SCOPE_ENDPOINTS.BASE`                 | `/access-scopes`                        | GET, POST     |
| `ACCESS_SCOPE_ENDPOINTS.byId(id)`             | `/access-scopes/:id`                    | DELETE        |
| _(analytics)_                                 | `/companies/:companyId/analytics/mood`  | GET           |

---

## Adding a New Company Feature

1. **Type** — add entity/DTO interfaces to `types/company.ts`.
2. **Endpoint** — add constant to `constants/companyEndpoints.ts`.
3. **Request** — add a typed function to the relevant file in `requests/`.
4. **Mapper** — add transformation logic to `mappers/company.mappers.ts` or `mappers/group.mappers.ts`.
5. **Hook** — add a custom hook in `hooks/` following the `useGroups` / `useInvites` pattern.
6. **Component** — add to `components/features/Company/` under the appropriate role sub-folder.
7. **Guard** — wrap the component in `<RoleGuard allowedRoles={[...]}>` or call `useRbac().can(...)` directly.
8. **i18n** — add strings to `messages/{en,uk,pl}/pages/Company.json`.
