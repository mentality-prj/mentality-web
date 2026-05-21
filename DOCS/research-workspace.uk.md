# Research Workspace та Reporting — гід для розробки

Дата: 2026-05-19

---

## Огляд

Research Workspace додає окремий авторизований простір для керованих research-проєктів, cohort management, grants, export requests, ML inspection і audit history.

Він відокремлений від legacy admin/company dashboard-ів і працює через окремий request layer на базі `research/v1` endpoint-ів.

Поруч із ним у цій же поставці з'явилися нові reporting surfaces для manager decision support, company/admin diagnostics і personal risk dashboard.

---

## Модель доступу

Доступ до research workspace визначається через `getResearchWorkspaceAccess()` у `requests/researchProjects.ts`.

Workspace доступний тоді, коли backend повертає одну з research capability, а роль платформи `admin` також має повний доступ:

- `scientist`
- `research_admin`

Прапорець `canCreateProjects` обчислюється з capability, доступного company scope та ролі платформи `admin`.

Захищений layout застосунку використовує цей результат, щоб вирішити, чи показувати пункт Research у навігації авторизованого користувача.

---

## Структура маршрутів

Усі користувацькі research-сторінки розташовані під `app/[locale]/(protected)/research/`.

| Шлях                                        | Призначення                                       |
| ------------------------------------------- | ------------------------------------------------- |
| `/research`                                 | Редирект на список research-проєктів              |
| `/research/projects`                        | Список доступних research-проєктів                |
| `/research/projects/create`                 | Створення нового research-проєкту                 |
| `/research/projects/:projectId`             | Redirect target для внутрішньої навігації проєкту |
| `/research/projects/:projectId/dashboard`   | Метадані та overview проєкту                      |
| `/research/projects/:projectId/members`     | Керування учасниками                              |
| `/research/projects/:projectId/cohort`      | Налаштування когорти                              |
| `/research/projects/:projectId/grants`      | Керування грантами                                |
| `/research/projects/:projectId/diagnostics` | ML-інспекція                                      |
| `/research/projects/:projectId/datasets`    | Перегляд історичного датасету                     |
| `/research/projects/:projectId/exports`     | Запити на експорт і inline download               |
| `/research/projects/:projectId/audit`       | Audit trail                                       |

`app/[locale]/(protected)/research/layout.tsx` є серверною точкою входу для access check і workspace navigation.

---

## UI-блоки

Research UI повторно використовує shared primitives проєкту, а не вводить окрему дизайн-систему.

Основні feature-компоненти:

- `components/features/Research/ResearchWorkspaceMenu.tsx`
- `components/features/Research/ResearchProjectInnerMenu.tsx`
- `components/features/Research/ResearchStateCard.tsx`
- `components/features/Research/ResearchProjectsList.tsx`
- `components/features/Research/CreateResearchProjectForm.tsx`
- `components/features/Research/ResearchProjectOverview.tsx`
- `components/features/Research/ResearchProjectMembersPanel.tsx`
- `components/features/Research/ResearchProjectCohortPanel.tsx`
- `components/features/Research/ResearchProjectGrantsPanel.tsx`
- `components/features/Research/ResearchProjectMLInspectionPanel.tsx`
- `components/features/Research/ResearchProjectHistoryDatasetPanel.tsx`
- `components/features/Research/ResearchProjectExportsPanel.tsx`
- `components/features/Research/ResearchProjectAuditPanel.tsx`

Ці компоненти свідомо перевикористовують `StaticCard`, `DashboardItem`, `InnerMenu` та існуючі `Button/Input/Select/Badge/Switch` primitives.

---

## Request layer

Канонічна frontend-інтеграція з research API знаходиться у `requests/researchProjects.ts`.

Вона покриває:

- визначення workspace access
- список проєктів і деталі проєкту
- create/update мутації проєкту
- CRUD для учасників
- читання/оновлення cohort
- читання/створення grants
- ML inspection queries
- отримання history dataset
- обробку export request
- отримання audit trail

Нормалізація відповідей навмисно толерантна до дрейфу backend response shape. Спільні доменні типи лежать у `types/research.ts`.

---

## Локалізація

Research copy описаний у:

- `messages/en/pages/Research.json`
- `messages/uk/pages/Research.json`
- `messages/pl/pages/Research.json`

Client-компоненти використовують `useTranslations('pages.Research')`, а server routes — `getTranslations('pages.Research')`.

Коли додається новий label, panel state або access message, усі три locale-файли мають оновлюватися в тому самому change set.

---

## Тестування

Поточне автоматизоване покриття нової research/reporting функціональності розбите за шарами:

- `requests/researchProjects.test.ts` перевіряє `research/v1` request layer і normalization
- `components/features/Research/ResearchProjectsList.test.tsx` перевіряє safe fallback для дат і невідомих status
- `app/[locale]/(protected)/research/layout.test.tsx` перевіряє workspace access gating
- `app/[locale]/(protected)/research/projects/page.test.tsx` перевіряє стани projects index route
- `components/features/Company/Manager/DecisionSupport/DecisionSupportWorkspace.test.tsx` перевіряє composition і scope selection у reporting workspace
- `helpers/reportingMappers.test.ts` і `helpers/reportingVisibility.test.ts` перевіряють трансформацію reporting data та policy-based visibility
- `requests/decisionSupport.test.ts` перевіряє request behavior для reporting/decision-support

---

## Пов'язані reporting surfaces

У цій же поставці додані або суттєво змінені reporting-маршрути поза research tree:

- `/company/manager/decision-support`
- `/company/admin/diagnostics`
- `/admin/r-and-d`
- `/admin/r-and-d/diagnostics`
- `/my-progress/statistics`

Ключові implementation files:

- `components/features/Company/Manager/DecisionSupport/DecisionSupportWorkspace.tsx`
- `components/features/Company/Manager/DecisionSupport/RiskEventsFeed.tsx`
- `components/features/Statistics/PersonalRiskDashboard.tsx`
- `components/shared/reporting/ReportingPrimitives.tsx`
- `requests/reportingClient.ts`
- `helpers/reportingMappers.ts`
- `helpers/reportingVisibility.ts`

Ці поверхні використовують спільні reporting domain types з `types/reporting.ts`.
