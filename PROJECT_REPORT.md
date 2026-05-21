# Dzvin.co Platform — Технічний звіт

> **Проєкт:** Dzvin.co
> **Стек:** Next.js (App Router) · React 18 · NestJS 11 · TypeScript · MongoDB (Mongoose) · OpenAI GPT-4.1 · Zitadel · Cloudinary
> **Дата звіту:** Травень 2026

---

## 1. Що це за продукт

**Dzvin.co** — корпоративна платформа підтримки ментального здоров'я.

> _«Застосунок, який перетворює щоденні чек-іни на дані для прийняття рішень на рівні компанії»_

Бекенд структурований у **три функціональні шари**, що відповідають трьом різним аудиторіям і цілям:

| Шар     | Аудиторія                | Ціль                                                      |
| ------- | ------------------------ | --------------------------------------------------------- |
| **B2C** | Співробітник             | Особистий психологічний трекер + персоналізований контент |
| **B2B** | HR / Менеджер / Компанія | Корпоративна аналітика, ризик-сигнали, керування командою |
| **R&D** | Система / Дослідники     | ML-інфраструктура, довіра до моделей, self-evaluation     |

У поточній web-поставці ці шари розведені в окремі delivery surfaces, а не зведені до одного універсального dashboard:

- **B2C** — особистий простір користувача, контент і персональна статистика
- **B2B** — manager decision support, company/admin diagnostics і policy visibility
- **R&D** — окремий **Research Workspace** під `/research`, який працює через `research/v1` і не змішується з admin/projection screens

---

## 2. Технічний стек

| Шар             | Технологія                              |
| --------------- | --------------------------------------- |
| Web client      | Next.js App Router, React 18, next-intl |
| UI              | Tailwind CSS + shared design primitives |
| Фреймворк       | NestJS 11 (Node.js)                     |
| Мова            | TypeScript 5                            |
| База даних      | MongoDB + Mongoose 8                    |
| Автентифікація  | Zitadel (OIDC / JWT)                    |
| AI              | OpenAI GPT-4.1, GPT-4.1-mini, o4-mini   |
| Медіа           | Cloudinary                              |
| Планувальник    | @nestjs/schedule (cron)                 |
| Events          | @nestjs/event-emitter                   |
| Документація    | Swagger / OpenAPI 3                     |
| Безпека         | Helmet, CORS whitelist, reCAPTCHA       |
| Package manager | pnpm                                    |

---

## 3. Архітектура

```
┌──────────────────────────────────────────────────────────────────────┐
│                     Web App (Next.js App Router)                    │
│  B2C surfaces | Manager/Admin reporting | Dedicated Research UI     │
├──────────────────────────────────────────────────────────────────────┤
│                               REST API                              │
│        (Zitadel JWT → ValidationPipe → domain namespaces)           │
├──────────────┬───────────────┬──────────────────────────────────────┤
│  B2C шар     │  B2B шар      │  R&D шар                             │
│  (особистий) │  (корпоратив) │  (ML / оцінка якості / research)     │
├──────────────┴───────────────┴──────────────────────────────────────┤
│                     MongoDB Collections (40+)                       │
│                     Mongoose, compound indexes                      │
└──────────────────────────────────────────────────────────────────────┘
```

---

## 4. Шар B2C — Особистий простір користувача

> _«Щоденний чек-ін, персоналізований контент і власна аналітика»_

### 4.1 Auth

Модуль отримує Bearer-токен від Zitadel, верифікує підпис через JWKS endpoint та автоматично створює або знаходить користувача в MongoDB.

- Немає власної реєстрації — ідентичність делегована Zitadel
- Перша авторизація = автоматичне створення акаунту (`findOrCreate`)
- Адмін-ролі через env-змінну (`ADMINS=email1,email2`)

**Endpoint:** `POST /api/auth/validate-token`

---

### 4.2 MoodRecord — серце продукту

> _«Кожен чек-ін — це 4 числа: настрій, стрес, енергія, фокус»_

Один запис містить 4 показники за шкалою **1–5**. Після збереження публікується подія `MOOD_CHECK_CREATED`, яку споживають MoodStory, MoodFeed та інші модулі.

**Можливості:**

- Повний чек-ін з опціональним AI-поясненням
- Quick mood (лише настрій)
- Stress spike (одиничний стрибок стресу)
- ML-selector рекомендованих вправ на основі поточного стану

**Endpoints:** `POST /mood-record`, `GET /mood-record`, `POST /mood-record/quick`, `POST /mood-record/stress-spike`

---

### 4.3 MoodStory

Генерується як серія екранів з текстом та CTA на основі останніх mood-записів. Підтримує регенерацію з варіантами. До останнього екрану автоматично додається рекомендована вправа.

---

### 4.4 MoodFeed

> _«Персоналізована стрічка контенту з адаптивними нагадуваннями»_

Стрічка формується щоденно (10:00 UTC) з вправ, афірмацій, порад і навчальних матеріалів.

**Adaptive nudges** — cron кожну годину визначає оптимальний час нагадування (`computeOptimalNudgeHour`) і надсилає push-сповіщення лише у відповідний часовий слот.

---

### 4.5 Weekly Insights

> _«Щотижневий AI-дайджест про власний психологічний стан»_

```
MoodRecord (14 днів)
  → агрегація + паттерни
  → AI (GPT-4.1) якщо ≥3 чек-іни / шаблон якщо менше
  → переклад (uk / en / pl)
  → MongoDB (ідемпотентно за weekKey)
```

Cron: **щопонеділка 08:00 UTC**

---

### 4.6 Психометричні тести

| Тест      | Що вимірює                                 | Шкала |
| --------- | ------------------------------------------ | ----- |
| **GAD-7** | Тривожність (Generalized Anxiety Disorder) | 0–21  |
| **PHQ-9** | Депресія (Patient Health Questionnaire)    | 0–27  |
| **K10**   | Психологічний дистрес (Kessler)            | 10–50 |

Однакова структура для всіх трьох: `POST` для проходження, `GET history`, `GET latest`.

---

### 4.7 MoodRisk — індивідуальний ризик

> _«Rule-based оцінка ризику на основі поведінкових паттернів»_

**riskLevel:** `low` / `medium` / `high`

```
100 mood-записів за 30 днів
  → features: волатильність, тренд, стрік, стрес-рівень, монотонність
  → K10 / GAD-7 / PHQ-9 результати (якщо є)
  → rule-based engine → riskLevel
  → збереження + видача
```

---

### 4.8 Prediction — траєкторія розвитку

- **Trajectory**: `worsening` / `stable` / `improving`
- **Confidence**: `low` / `medium` / `high`
- **Risk window**, **pattern continuation probability**, **scenario simulation**

Результати зберігаються у `PredictionSnapshot` і живлять Decision Support CohortMetric.

**Endpoints:** `GET /users/me/prediction`, `POST /users/me/prediction/scenario`, `GET /users/me/prediction/evidence`

---

### 4.9 Особистий контент та утиліти

| Модуль                       | Опис                                                        |
| ---------------------------- | ----------------------------------------------------------- |
| **Exercises**                | AI-генеровані вправи + ML-selector з impression history     |
| **Affirmations**             | Позитивні твердження з AI-генерацією зображень (Cloudinary) |
| **Tips**                     | Поради ментального здоров'я                                 |
| **Games / Attention Sprint** | Когнітивна гра на увагу                                     |
| **Learning**                 | Навчальні матеріали з відстеженням прогресу                 |
| **Tags / UserTags**          | Система тегів для персоналізації контенту                   |
| **Diary**                    | Особистий щоденник, markdown-нотатки з AI-аналізом          |
| **Goals**                    | Особисті цілі з відстеженням статусу (active → completed)   |
| **Favorites**                | Закладки по будь-якому типу контенту                        |
| **UserStatistics**           | Агрегована особиста статистика (mood, psytest, streak)      |
| **Contact**                  | Форма зворотного зв'язку з reCAPTCHA + Telegram-сповіщення  |

---

## 5. Шар B2B — Корпоративна аналітика

> _«Від чек-інів команди до управлінських рішень»_

### 5.1 Організаційна структура

- **Companies** — CRUD компаній; резолюція компанії за userId через групове членство
- **Groups** — дерево підрозділів із **Closure Table** для ефективних ієрархічних запитів
- **Employees** — учасники компанії, ролі та salary grades
- **Access Scopes** — гранульовані дозволи (manager / company scope)
- **Invites** — запрошення (accept / decline / cancel)
- **Salary Grades** — тарифні сітки з діапазонами EUR

---

### 5.2 DecisionSupportService — генератор корпоративних звітів

**DecisionReport містить:**

- Показники компанії: стрес, настрій, енергія, фокус, **burnout index**
- **Team ranking** — ранжування команд за ризиком вигорання
- Список **risk events** з пріоритетами і severity
- **Change tracking** — зміни відносно попереднього periodKey
- **Estimated impact** — вплив на продуктивність / утримання
- **AI executive summary** (GPT-4.1)

**Звітні періоди:** `week` / `month` / `quarter` / `half-year` / `year`

**Risk Events lifecycle:**

- Fingerprint → ідемпотентні upsert
- Статуси: `active` → `escalating` → `resolved`, також `suppressed`
- Severity: `low` / `medium` / `high` / `critical`
- Resolution types: `action_taken` / `wont_fix` / `false_positive` / `auto_resolved`
- Ескалація після N повторень (`occurrenceCount`)
- Cooldown після `resolved` / `suppressed`

**Action types:** `team_intervention` / `manager_alert` / `org_change`

---

### 5.3 Фонові задачі Decision Support

| Задача                | Розклад         | Що робить                                             |
| --------------------- | --------------- | ----------------------------------------------------- |
| Daily risk scan       | Щодня 06:00 UTC | Upsert high/critical risk events для всіх компаній    |
| Weekly full report    | Пн 08:00 UTC    | Повний звіт + AI-саммарі для всіх компаній            |
| Cohort metrics daily  | Щодня 03:30 UTC | Матеріалізація cohort-метрик для evidence             |
| Cohort metrics weekly | Пн 04:00 UTC    | Повний перерахунок когорт за тиждень                  |
| Audit reconciliation  | Щодня 02:15 UTC | Звіряє dirty days з повним перерахунком audit-summary |

---

### 5.4 Evidence Service

`DecisionSupportEvidenceService` обчислює **RiskAssociationEvidence** для кожної risk-події:

- Когортне порівняння за granularity level (team size / industry)
- Materialized `CohortMetric` — агреговані еталони для швидкого порівняння

**Endpoint:** `GET companies/:id/decision-support/risk-events/:eventId/evidence`

---

### 5.5 Public Admin Reporting API

Поточний публічний набір admin/reporting endpoints у frontend обмежений п'ятьма route-ами:

```
GET  /api/operational/v1/reports/overview
GET  /api/operational/v1/risk-events/feed
GET  /api/operational/v1/ml/inspection
GET  /api/admin-diagnostics/v1/ml/inspection
GET  /api/admin-diagnostics/v1/ml/policy-metrics
```

| Legacy admin flow                                                     | Поточний публічний endpoint                       |
| --------------------------------------------------------------------- | ------------------------------------------------- |
| Старий admin overview                                                 | `GET /api/operational/v1/reports/overview`        |
| Старий admin risk events feed                                         | `GET /api/operational/v1/risk-events/feed`        |
| Старий admin ML inspection для основного UX                           | `GET /api/operational/v1/ml/inspection`           |
| Старий admin raw diagnostics inspection                               | `GET /api/admin-diagnostics/v1/ml/inspection`     |
| `GET /api/companies/:companyId/decision-support/admin/policy/metrics` | `GET /api/admin-diagnostics/v1/ml/policy-metrics` |

Legacy admin policy endpoints нижче лишилися в сервісному шарі/старій документації, але зараз не мають публічного replacement route в controller/OpenAPI і не повинні використовуватися фронтендом:

| Legacy endpoint                                                    | Статус                                |
| ------------------------------------------------------------------ | ------------------------------------- |
| `GET companies/:id/decision-support/admin/policy/pipeline-metrics` | Публічного route зараз немає          |
| `GET companies/:id/decision-support/admin/policy/audit`            | Service є, але публічного route немає |
| `POST companies/:id/decision-support/admin/policy/override`        | Service є, але публічного route немає |

---

### 5.6 Frontend reporting surfaces

Корпоративна аналітика у web-клієнті більше не живе в одному legacy dashboard. Поточна поставка розкладає B2B/reporting сценарії на окремі поверхні, які використовують спільний data layer, але обслуговують різні ролі й контексти.

| Route                               | Аудиторія     | Призначення                                                         |
| ----------------------------------- | ------------- | ------------------------------------------------------------------- |
| `/company/manager/decision-support` | Manager       | Операційний decision support, risk events, короткі управлінські дії |
| `/company/admin/diagnostics`        | Company admin | Діагностика policy/ML runtime, audit і trust-related signals        |
| `/admin/r-and-d`                    | Admin / R&D   | Зведений вхід у R&D reporting і ML-related surfaces                 |
| `/admin/r-and-d/diagnostics`        | Admin / R&D   | Поглиблена діагностика та інспекція signal quality                  |
| `/my-progress/statistics`           | Співробітник  | Personal risk dashboard і пояснення власної динаміки                |

Ці поверхні спираються на спільні frontend-примітиви та типи:

- `requests/reportingClient.ts` — request layer для reporting endpoints
- `helpers/reportingMappers.ts` і `helpers/reportingVisibility.ts` — нормалізація та policy-based visibility
- `types/reporting.ts` — єдина доменна модель reporting view models
- `components/shared/reporting/ReportingPrimitives.tsx` — перевикористовувані UI-блоки для confidence, insights і explanation cards

---

## 6. Шар R&D — ML-інфраструктура та оцінка якості

> _«Система знає, наскільки можна довіряти власним передбаченням»_

### 6.1 DecisionSupportMlService — ML скоринг

ML-модуль обчислює `riskScore` (0–1) як зважену суму трьох компонентів:

| Компонент              | Вага за замовч. | Що вимірює                            |
| ---------------------- | --------------- | ------------------------------------- |
| Prediction probability | 0.55            | Ймовірність worsening траєкторії      |
| Anomaly score          | 0.25            | Відхилення від baseline команди       |
| Z-score                | 0.20            | Статистичне відхилення від середнього |

**Режими роботи:**

- `heuristic` — rule-based fallback (без ML-моделі)
- `logistic-regression` — логістична регресія із завантаженого model bundle
- `random-forest` — модель випадкового лісу із завантаженого model bundle
- Auto-mode: якщо `DS_ML_MODEL_TYPE` не задано → `recommendedModelType` з bundle → fallback `heuristic`

**Підтримувані ML targets:** `company` / `team` (інші → `no_data` fallback без виклику ML)

**Кешування:** в межах одного company-run результати кешуються per `target:targetId` зі збереженням `fallbackReason`.

---

### 6.2 DecisionSupportOnlineEvaluationService — оцінка якості моделі

- **A/B тестування** — variant A vs B із fingerprint-based routing і налаштовуваним % трафіку
- **Model drift detection** — порівняння нещодавніх показників з baseline
- **Trust score** (0–1): `low` < 0.45 / `medium` < 0.65 / `high` ≥ 0.65
- **Auto-mitigation** — 2+ degraded цикли → safe-mode (fallback_rules); відновлення після 3 healthy циклів
- **Policy override** з hysteresis і expiry
- **Audit trail** — кожна policy-зміна логується з reason і джерелом

---

### 6.3 Policy Decision Matrix (`resolveRuntimePolicy`)

| Умова                               | Стратегія                                             |
| ----------------------------------- | ----------------------------------------------------- |
| `forcePolicy = rules_only`          | `override_rules_only`                                 |
| ML недоступний / forceRulesFallback | `fallback_rules_no_ml` / `fallback_rules_degraded_ml` |
| trust < 0.65, variant A             | `blend_rules_cohort_low_trust_ml`                     |
| trust < 0.65, variant B             | `variant_b_blend_rules_cohort_low_trust_ml_tuned`     |
| cohort guard triggered, variant B   | `variant_b_blend_ml_cohort_guarded`                   |
| variant B, без cohort guard         | `variant_b_blend_ml_rules_tuned`                      |
| cohort guard triggered, variant A   | `blend_ml_cohort_guarded`                             |
| ML > rules на ≥ 0.15                | `prefer_ml`                                           |
| rules > ML на ≥ 0.15                | `prefer_rules`                                        |
| Інакше                              | `blend_ml_rules`                                      |

---

### 6.4 AI-шар (`AiRouterService`)

| Задача                   | Модель за замовчуванням  |
| ------------------------ | ------------------------ |
| Mood Tip                 | GPT-4.1-mini             |
| Calming Exercise         | GPT-4.1                  |
| Journal Analysis         | GPT-4.1                  |
| Mental Test Analysis     | o4-mini                  |
| Mood Story               | GPT-4.1-mini             |
| Weekly Insights          | GPT-4.1                  |
| Decision Support Summary | GPT-4.1 (конфігурується) |

Кожна модель — окрема env-змінна, замінна без перезбірки.

---

### 6.5 Research Workspace (`research/v1`)

Окремо від manager/admin reporting surfaces у web-клієнті з'явився ізольований **Research Workspace** для користувачів з capability `scientist` або `research_admin`; роль платформи `admin` також має повний доступ.

Його ціль — дати дослідницьким сценаріям власний простір і власний request namespace, замість того щоб змішувати governance, grants і ML inspection з корпоративними dashboards.

| Route                                       | Призначення                         |
| ------------------------------------------- | ----------------------------------- |
| `/research/projects`                        | Список доступних research-проєктів  |
| `/research/projects/create`                 | Створення нового research-проєкту   |
| `/research/projects/:projectId/dashboard`   | Overview, metadata, state           |
| `/research/projects/:projectId/members`     | Керування учасниками                |
| `/research/projects/:projectId/cohort`      | Налаштування cohort                 |
| `/research/projects/:projectId/grants`      | Grant management                    |
| `/research/projects/:projectId/diagnostics` | ML inspection                       |
| `/research/projects/:projectId/datasets`    | Історичний dataset                  |
| `/research/projects/:projectId/exports`     | Export requests і governed download |
| `/research/projects/:projectId/audit`       | Audit trail                         |

Ключові принципи реалізації:

- access gate визначається через `getResearchWorkspaceAccess()` і capability-based response backend-а
- увесь frontend request layer винесено в `requests/researchProjects.ts`
- інтеграція працює через `research/v1`, а не через legacy B2B endpoints
- UI перевикористовує наявні shared primitives (`StaticCard`, `InnerMenu`, `Button`, `Input`, `Select`, `Badge`) замість окремої дизайн-системи

---

## 7. Інфраструктура та безпека

### Безпека

- **Helmet** — HTTP security headers
- **CORS whitelist** — тільки дозволені origins (`CORS_ORIGINS`)
- **Zitadel JWT** — верифікація через JWKS (секрет не зберігається)
- **reCAPTCHA** — захист форми зворотного зв'язку (Contact module, Google Recaptcha v2)
- **ValidationPipe** — whitelist + transform на всіх endpoints

### Багатомовність

TranslationsService підтримує **uk / en / pl** для Weekly Insights, MoodStory та AI-контенту.

### MongoDB Health

`MongoKeepAliveService` виконує ping **кожні 15 хвилин** (`*/15 * * * *`) щоб уникнути connection timeout на serverless-оточеннях.

---

## 8. Зведений граф модулів

```
Web App
  ├── B2C surfaces: Mood / Content / Statistics
  ├── Reporting surfaces: Manager Decision Support / Admin Diagnostics / Personal Risk
  └── Research Workspace (/research → research/v1)
        │
Auth ──────────────────────────────► Users
                  │
            ┌────────┼────────┐
          Companies  Groups  Employees
            │         │
          AccessScopes  Invites / SalaryGrades

MoodRecord ──► MoodFeed ──► AdaptiveNudges (cron hourly)
    │   └────► MoodStory ──► AI (GPT-4.1-mini)
    │   └────► WeeklyInsights ──► AI (GPT-4.1) ──► Translations
    │   └────► MoodRisk ──► [K10, GAD-7, PHQ-9]
    │   └────► UserStatistics
    │
    └──────────────────────────────────────────────────────────┐
                          │
           Prediction (trajectory + scenarios)    │
             │                              │
          DecisionSupport ─────────────────────── ┘
          ├── ML Service (logistic-regression / random-forest / heuristic)
          ├── Evidence Service (CohortMetric materialization)
          ├── Online Evaluation (A/B · drift · trust · policy · audit)
          └── Research namespace (`research/v1`)

Content: Exercises · Affirmations · Tips · Games · Learning · Tags
Personal: Diary · Goals · Favorites · Statistics · Contact
```

---

## 9. Ключові числа

| Показник                    | Значення                                                |
| --------------------------- | ------------------------------------------------------- |
| Модулів NestJS              | 30+                                                     |
| MongoDB колекцій            | 40+                                                     |
| Endpoints (REST)            | ~90                                                     |
| Cron-задач                  | 9 (5 DS + WeeklyInsights + MoodFeed×2 + MongoKeepAlive) |
| AI-задач (типів)            | 7                                                       |
| Мов інтерфейсу              | 3 (uk / en / pl)                                        |
| Окремих web surfaces        | 5 (research + 4 reporting surfaces)                     |
| ML-компонентів у risk score | 3 (prediction + anomaly + z-score)                      |
| ML моделей                  | 3 (heuristic / logistic-regression / random-forest)     |
| Policy стратегій            | 11 (від override_rules_only до blend_ml_rules)          |
| Шкала mood-показників       | 1–5 (mood, stress, energy, focus)                       |

---

## 10. Слайди для презентації

### Слайд 1 — Одне речення про продукт

> Dzvin.co — корпоративна платформа, яка перетворює щоденні психологічні чек-іни співробітників на аналітику для HR та персональний трекер розвитку для кожного.

### Слайд 2 — Три шари функціональності

> - **B2C:** щоденний чек-ін (шкала 1–5) → AI-порада → тижнева аналітика → прогноз траєкторії
> - **B2B:** manager decision support + admin diagnostics → risk events із severity, evidence і policy visibility
> - **R&D:** ML скоринг (3 компоненти, 3 моделі) → A/B → drift → trust score → auto-mitigation + окремий Research Workspace на `research/v1`

### Слайд 3 — User journey

> 1. Щоденний чек-ін (настрій + стрес + енергія + фокус, шкала 1–5)
> 2. AI одразу дає пораду / вправу / афірмацію
> 3. Щотижнева аналітика — де ти зараз і куди рухаєшся
> 4. Прогноз: worsening / stable / improving
> 5. Менеджер / admin бачить окремі reporting surfaces: decision support, diagnostics, personal risk views
> 6. Scientist / research admin працює в окремому Research Workspace з cohort, grants, exports, ML inspection і audit

### Слайд 4 — Reporting + Research одним реченням

> Система щодня аналізує стан усіх команд, будує ML risk score з трьох компонентів, генерує risk events з доказовою базою та AI-саммарі, віддає ці сигнали в окремі manager/admin reporting surfaces і паралельно надає дослідникам ізольований Research Workspace на `research/v1`.

### Слайд 5 — AI в системі

> Сім спеціалізованих AI-задач на трьох моделях OpenAI. Модель для кожної задачі — окрема env-змінна. Найдорожча (o4-mini) — тільки для аналізу психотестів. Найдешевша (GPT-4.1-mini) — для частих щоденних порад.
