# Управління компанією — Гід для розробника та адміністратора

Дата: 2026-03-28

---

## Огляд

Функціональність управління компанією додає мультитенантну B2B-підтримку до Mentality Web.
Вона вводить три **ролі компанії**, що накладаються поверх системних ролей `admin`/`user`, ієрархію груп, запрошення співробітників, scope доступу для менеджерів та аналітичний дашборд.

Системна роль `admin` (`session.user.role`) використовується для дій на рівні платформи (створення компаній). Ролі компанії (`session.user.companyRole`) керують усім всередині компанії.

---

## Ієрархія ролей

| Роль              | Константа                       | Хто це                                                               |
| ----------------- | ------------------------------- | -------------------------------------------------------------------- |
| системний `admin` | `session.user.role === 'admin'` | Адмін платформи — створює компанії через `/admin/company`            |
| `SUPERUSER`       | `COMPANY_ROLES.SUPERUSER`       | Власник компанії — керує своєю компанією, групами та співробітниками |
| `MANAGER`         | `COMPANY_ROLES.MANAGER`         | Тімлід — запрошує співробітників у групи, призначені Адміном         |
| `EMPLOYEE`        | `COMPANY_ROLES.EMPLOYEE`        | Кінцевий користувач — отримує запрошення та приєднується             |

Роль компанії зберігається у `session.user.companyRole` (див. `types/next-auth.d.ts`).
Масиви дозволів визначені у `types/rbac.ts`:

```ts
CAN_MANAGE_GROUPS = [SUPERUSER]
CAN_INVITE_EMPLOYEES = [SUPERUSER, MANAGER]
CAN_ASSIGN_MANAGERS = [SUPERUSER]
CAN_VIEW_ANALYTICS = [SUPERUSER, MANAGER]
```

Створення компаній захищено системною роллю `admin`, а не роллю компанії.

---

## Структура URL

Усі сторінки компанії розміщені під `app/[locale]/company/`:

| Шлях               | Доступ                                                                                       |
| ------------------ | -------------------------------------------------------------------------------------------- |
| `/company`         | Будь-який авторизований користувач з `companyRole` або системний `admin` (редирект за роллю) |
| `/admin/company`   | Лише системний `admin` (`session.user.role === 'admin'`)                                     |
| `/company/admin`   | Лише `SUPERUSER`                                                                             |
| `/company/manager` | Лише `MANAGER`                                                                               |

Спільний layout (`app/[locale]/company/layout.tsx`) виконує серверні захисти:

1. Не авторизований → редирект на `/signin`
2. Системний `admin` → пропускається (навіть без `companyRole`)
3. Немає валідної `companyRole` у сесії → редирект на `/`

Індексна сторінка (`/company`) автоматично перенаправляє користувача на панель відповідно до його ролі.

---

## Опис панелей

### Global Admin — `/admin/company`

**Хто:** Лише адмін платформи (системна роль `admin`, тобто `session.user.role === 'admin'`).

**Що робить:**

- **Створення компанії** — форма з полем назви компанії; викликає `POST /companies`; після успіху створюється новий `CompanyEntity`.

**Компоненти:** `GlobalAdmin/CreateCompanyForm`

---

### Company Admin — `/company/admin`

**Хто:** Власник компанії (`SUPERUSER`).

Сторінка поділена на п'ять секцій:

#### 1. Управління групами

Групи організовані як **дерево** (батько ↔ діти). Кожен вузол підтримує:

- **Редагування на місці** — натисніть іконку редагування, змініть назву, натисніть Enter або кнопку «Зберегти».
- **Додати дочірню групу** — натисніть `+` на вузлі, щоб створити підгрупу.
- **Видалення** — доступне лише для листових вузлів (без дітей); викликає `DELETE /groups/:id`.

Кнопка **«Додати групу»** на кореневому рівні створює нову групу верхнього рівня в компанії.

Компоненти: `CompanyAdmin/ManageGroups/GroupTree`, `GroupTreeNode`
Запити: `createGroup`, `updateGroup`, `deleteGroup` з `requests/groups.ts`

#### 2. Список співробітників

**Пагінована таблиця** поточних співробітників. Колонки: повне ім'я, email, роль, групи, дата приєднання.

Пагінація керується через локальний стан; кнопки «Попередня / Наступна».

Компоненти: `CompanyAdmin/EmployeeList/EmployeeTable`
Запити: `GET /employees?page={page}&limit={limit}`

#### 3. Запросити співробітника

Надіслати запрошення на email новому співробітнику.

- **Email** — валідується (повинен бути коректною адресою).
- **Роль** — `EMPLOYEE` або `MANAGER`.
- **Групи** — мультиселект у вигляді дерева; потрібна хоча б одна група.

Запрошення створюється через `POST /invites`; початковий статус — `pending`.

Компоненти: `CompanyAdmin/InviteEmployee/InviteEmployeeForm`

#### 4. Очікуючі запрошення

Спільна таблиця з усіма активними запрошеннями (статус: `pending | accepted | expired`).

Дії на рядок:

- **Повторно надіслати** — доступне для `pending` та `expired`; викликає `POST /invites/:id/resend`.
- **Скасувати** — доступне лише для `pending`; викликає `DELETE /invites/:id`.

Після кожної дії рядок оптимістично видаляється/оновлюється в UI.

Компоненти: `InviteList/InviteList`
Хук: `useInvites(page)`

#### 5. Призначити доступ менеджеру

Надати Менеджеру доступ до конкретних груп та (опціонально) до аналітики.

- Виберіть Менеджера зі списку співробітників (відфільтровано за роллю `MANAGER`).
- Виберіть групи, до яких Менеджер матиме доступ (мультиселект-дерево).
- Увімкніть **«Дозволити аналітику»**, щоб Менеджер міг переглядати mood-аналітику своїх груп.
- Натисніть **«Зберегти»** → створюються записи `AccessScopeEntity` через `POST /access-scopes`.
- Існуючі scope-записи відображаються нижче з кнопкою **«Відкликати»** на кожному.

Компоненти: `CompanyAdmin/AssignManager/AssignManagerForm`
Запити: `createAccessScope`, `deleteAccessScope`, `getAccessScopes`

---

### Manager — `/company/manager`

**Хто:** Тімлід (`MANAGER`).

Сторінка містить три секції:

#### 1. Запросити співробітника

Той самий флоу, що й форма адміна, але:

- Роль зафіксована на **лише EMPLOYEE** (Менеджери не можуть запрошувати інших Менеджерів).
- Селектор **Груп** показує всі групи компанії Менеджера. Групи завантажуються через `useGroups()`, який автоматично розв'язує `companyId` через `GET /companies/my`.
- Якщо в компанії немає груп, форма відключена з пояснювальним повідомленням.

Компоненти: `Manager/InviteEmployeeManagerForm`

#### 2. Очікуючі запрошення

Той самий спільний компонент `InviteList`, відфільтрований за запрошеннями, які створив цей Менеджер.

#### 3. Аналітика

**Дашборд** (Recharts `LineChart`) з показниками настрою, стресу, енергії та фокусу за періодами. Складається з:

- **Сумарні картки** — всього співробітників, активні співробітники, загальна кількість чекінів та середні бали.
- **Розподіл ризиків** — кількість співробітників з низьким / середнім / високим ризиком у вигляді кольорових бейджів.
- **Графік тренду** — лінійний графік з чотирма рядами (настрій / стрес / енергія / фокус) по місяцях.
- **Таблиця груп** — детальна розбивка за кожною групою з усіма метриками.

**Діапазон дат** — два date picker-и (`від` / `до`). Максимальний діапазон — **1 рік**; якщо вибрати більший, форма показує помилку й не застосовує фільтр.

**Фільтр груп** — мультиселект-дерево; показує всі групи компанії.

Надсилає запит `GET /companies/:companyId/analytics/mood?from=...&to=...&groupIds=...`.

`companyId` розв'язується автоматично: для системного адміна — з `AdminCompanyContext`; для менеджера — отримується через `GET /companies/my` перед запитом аналітики.

Функції запитів: `requests/analytics.ts` — `getMoodAnalytics` (менеджер) та `getMoodAnalyticsAdmin` (системний адмін).

Хук: `hooks/useAnalytics.ts`

Компоненти: `Manager/AnalyticsView`

**Формат відповіді аналітики:**

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

Повні типи наведено в `types/company.ts`.

---

## Спільні компоненти

### `GroupSelector`

`components/features/Company/GroupSelector/GroupSelector.tsx`

Рекурсивний деревоподібний мультиселект із пошуком.

| Проп            | Тип                       | Опис                      |
| --------------- | ------------------------- | ------------------------- |
| `groups`        | `GroupEntity[]`           | Повне дерево груп         |
| `selected`      | `string[]`                | ID вибраних груп          |
| `onChange`      | `(ids: string[]) => void` | Обробник зміни вибору     |
| `disabledIds?`  | `string[]`                | ID, що не можна вибрати   |
| `singleSelect?` | `boolean`                 | Обмежити до одного вибору |

Пошук фільтрує вузли за назвою по всьому дереву; вибір батьківського вузла не вибирає автоматично дітей — кожен вузол перемикається окремо.

### `RoleGuard`

`components/features/Company/RoleGuard.tsx`

Клієнтський захист, що умовно рендерить дочірній контент.

```tsx
<RoleGuard allowedRoles={[COMPANY_ROLES.SUPERUSER]}>
  <AdminOnlyWidget />
</RoleGuard>
```

| Проп           | Опис                                                       |
| -------------- | ---------------------------------------------------------- |
| `allowedRoles` | Масив значень `CompanyRole`, яким дозволено бачити контент |
| `fallback?`    | Елемент для рендеру, якщо у користувача немає доступу      |

Всередині викликає `useRbac().can(allowedRoles)`. Поки сесія завантажується — нічого не рендерить (уникає flash).

### Хук `useRbac`

`hooks/useRbac.ts`

```ts
const { role, can, isLoading } = useRbac()

// role    → CompanyRole | undefined
// can([COMPANY_ROLES.MANAGER]) → boolean
// isLoading → true поки сесія завантажується
```

---

## Життєвий цикл запрошення

```
створено (pending)
   │
   ├─ користувач прийняв посилання → accepted
   ├─ адмін/менеджер повторно надіслав → pending (оновлений термін дії)
   └─ адмін/менеджер скасував → видалено
         │
         └─ минув час → expired
                 │
                 └─ повторно надіслати → pending знову
```

Компонент `InviteList` показує badge статусу в кожному рядку та відповідно вмикає/вимикає «Повторно надіслати» і «Скасувати».

---

## Структура даних дерева груп

```ts
interface GroupEntity {
  id: string
  name: string
  children: GroupEntity[] // рекурсивно
  parentId: string | null
}
```

`flattenGroups(groups)` у `mappers/group.mappers.ts` виконує depth-first flatten — корисно, коли потрібен плаский список усіх ID груп (наприклад, для пошуку access scope).

---

## Довідник API-ендпоінтів

Визначені у `constants/companyEndpoints.ts`:

| Константа                                     | Значення                                | Метод(и)      |
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
| _(аналітика)_                                 | `/companies/:companyId/analytics/mood`  | GET           |

---

## Додавання нової функції до компанії

1. **Тип** — додайте entity/DTO інтерфейси до `types/company.ts`.
2. **Ендпоінт** — додайте константу до `constants/companyEndpoints.ts`.
3. **Запит** — додайте типізовану функцію до відповідного файлу в `requests/`.
4. **Маппер** — додайте логіку трансформації до `mappers/company.mappers.ts` або `mappers/group.mappers.ts`.
5. **Хук** — створіть кастомний хук у `hooks/`, дотримуючись патерну `useGroups` / `useInvites`.
6. **Компонент** — додайте до `components/features/Company/` у відповідну підпапку ролі.
7. **Захист** — оберніть компонент у `<RoleGuard allowedRoles={[...]}>` або викликайте `useRbac().can(...)` напряму.
8. **i18n** — додайте рядки до `messages/{en,uk,pl}/pages/Company.json`.
