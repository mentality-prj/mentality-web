# Backlog (Issues)

Цей файл — перелік задач оформлених як заготовки для GitHub Issues. Скопіюй команду `gh issue create` під кожною задачею, або створи Issue через UI.

---

### Run full TypeScript check and fix errors

Labels: `chore`, `type-check`

---

Запустити `pnpm test` і виправити тести, що впали після змін (mock/intl adjustments, server/client splits).

Suggested command:

```
gh issue create --title "Run unit tests and fix failures" --body "Run `pnpm test` and address failing tests; update mocks or tests as needed (next-intl, auth mocks)." --label test
```

---

### Remove REST/mockApi.ts safely

Labels: `chore`, `cleanup`

Опис:
Переконатися, що `REST/mockApi.ts` не імпортується більше в коді, потім видалити файл. Якщо потрібна тимчасова міграція — додати заміну або перенаправлення.

Suggested command:

```
gh issue create --title "Remove REST/mockApi.ts (cleanup)" --body "Ensure no imports of REST/mockApi.ts remain and safely remove the file, or replace with real API wrappers where needed." --label cleanup
```

---

### Verify API wrappers and header handling

Labels: `bug`, `backend`

Опис:
Перевірити `requests/*` wrappers (особливо `getUnpublished*` and X-Total-Count header parsing) щоб вони відповідають контракту бекенду.

Suggested command:

```
gh issue create --title "Verify API request wrappers and X-Total-Count handling" --body "Confirm requests in `requests/` match backend API (headers, pagination). Add tests or adjust parsing of X-Total-Count if inconsistent." --label backend
```

---

### Audit remaining client components to convert to server where appropriate

Labels: `refactor`, `server-components`

Опис:
Просканувати кодову базу на компоненти `*Client` та вирішити, які з них потрібно перевести на серверні версії або створити відповідні client-копії для адмін-панелей.

Suggested command:

```
gh issue create --title "Audit and convert client components to server components where appropriate" --body "Scan for components using client-side hooks and convert to server components where data fetching / auth can be done server-side. Keep client copies for admin/edit flows." --label refactor
```

---

### Consolidate translations across locales

Labels: `i18n`, `chore`

Опис:
Перевірити, що для всіх нових ключів (наприклад `pages.Guide.*.empty`) є переклади у `messages/*` для всіх локалей (en, uk, pl). Додати відсутні переклади або падінг-тексти.

Suggested command:

```
gh issue create --title "Consolidate translations for new Guide keys" --body "Ensure `pages.Guide` new keys exist in en/uk/pl and add missing translations. Run a script or inspection to find missing keys." --label i18n
```

---

### Find and replace duplicated modal patterns with FullScreenCard

Labels: `refactor`, `ui`

Опис:
Знайти інші місця, де дублюється full-screen Card/modal і замінити на `components/Cards/FullScreenCard.tsx`.

Suggested command:

```
gh issue create --title "Replace duplicated full-screen modal patterns with FullScreenCard" --body "Find components rendering full-screen Card modals and refactor to use `FullScreenCard` to reduce duplication." --label refactor
```

---

### Add localized metadata for Guide pages (optional)

Labels: `enhancement`, `i18n`

Опис:
Додати `generateMetadata` у `app/[locale]/(protected)/guide/layout.tsx` або в сторінку, щоб забезпечити локалізований title/description для Guide.

Suggested command:

```
gh issue create --title "Add localized metadata for Guide pages" --body "Add `generateMetadata` with `getTranslations('pages.Guide')` to provide localized title/description for the Guide section." --label enhancement
```

### Final cleanup: remove leftover mocks/imports

Labels: `cleanup`, `chore`

Опис:
Провести фінальний grep на `mockApi`/`REST` references і завершити видалення інтернал mock-ів.

Suggested command:

```
gh issue create --title "Final cleanup: remove leftover mock references" --body "Search for residual imports of in-repo mocks and remove or update them to real API wrappers." --label cleanup
```

---

_Якщо хочеш — можу автоматично створити Issues за цими шаблонами, але для цього мені потрібні доступи/токен або ти можеш виконати наведені `gh issue create` команді локально._

---

### API implementation tasks (from openapi.json)

Labels: `backend`, `integration`, `chore`

Опис:
Після перегляду `openapi.json` є кілька endpoint-ів, для яких потрібно:

- додати/перевірити frontend `requests/*` wrappers;
- реалізувати UI/UX інтеграцію (pages, admin flows, statistics views);
- додати тести та оновити обробку заголовків (наприклад `X-Total-Count`).

Suggested issues (one per area):

```
gh issue create --title "Implement Statistics API integration" --body "Endpoints: `/api/statistics/{userId}`, `/api/statistics/exercise`.\n\nTasks:\n- Implement `requests/statistics.ts` wrappers\n- Add frontend UI to surface user statistics and exercise recording\n- Ensure backend paging/aggregation contracts are respected" --label backend
```

```
gh issue create --title "Implement Shop & Cart API wrappers" --body "Endpoints: shop products, cart data.\n\nTasks:\n- Add `requests/shop.ts` and `requests/cart.ts` wrappers\n- Replace `REST/mockApi.ts` usages for shop/cart pages\n- Add tests and e2e flows for checkout (if applicable)" --label backend
```

```
gh issue create --title "Integrate AI generation endpoints (affirmations, tips, exercises)" --body "Endpoints: `/api/affirmations/generate`, `/api/tips/generate`, `/api/exercises/generate`.\n\nTasks:\n- Implement server-side wrappers for generation endpoints (admin flows)\n- Add UI pages/forms for generation and review (admin only)\n- Ensure generated content is saved and localized" --label integration
```

```
gh issue create --title "Implement Diary and Goals API integration" --body "Endpoints: `/api/diary`, `/api/goals`.\n\nTasks:\n- Implement `requests/diary.ts` and `requests/goals.ts` wrappers\n- Connect diary and goals pages to API for CRUD operations\n- Add tests and handle auth headers" --label backend
```

```
gh issue create --title "Integrate MoodRecord endpoints and UI" --body "Endpoints: `/api/mood-record` and related.\n\nTasks:\n- Implement `requests/moodrecord.ts` wrapper\n- Add UI for mood submission, last N records, and charting\n- Ensure pagination and filtering (active/inactive) is supported" --label backend
```

```
gh issue create --title "Tags and User-Tags management integration" --body "Endpoints: `/api/tags`, `/api/user-tags`.\n\nTasks:\n- Implement `requests/tags.ts` and `requests/usertags.ts` wrappers\n- Connect admin tag pages and user tag flows\n- Add tests and i18n for tag translations" --label backend
```

```
gh issue create --title "Finalize Exercises & Pagination handling" --body "Endpoints: `/api/exercises`, `/api/exercises/unpublished`.\n\nTasks:\n- Ensure `requests/exercises.ts` parses `X-Total-Count` headers and supports pagination\n- Connect exercises lists (public/admin) to real endpoints\n- Update tests and UI accordingly" --label backend
```

Notes:

- These issues reflect endpoints present in `openapi.json` that need frontend wrappers, UI work, or further validation. Create more granular tasks if desired.

---

### Remove individual REST mocks

Labels: `cleanup`, `chore`

Опис:
Забезпечити поступове видалення окремих моків у `REST/mockApi.ts`. Для кожного моку необхідно:

- перевірити, які сторінки/функціонал його використовують;
- замінити виклики на реальні `requests/*` wrappers або додати тимчасовий адаптер;
- видалити функцію з `REST/mockApi.ts` та відповідні імпорти.

Suggested commands (run one per mock):

```
gh issue create --title "Remove REST mock: mockCartData" --body "Page/functionality: Cart page — shopping cart data used in cart and checkout flows. Ensure `requests/cart` is implemented or replace usages before removing `mockCartData` from `REST/mockApi.ts`." --label cleanup
```

```
gh issue create --title "Remove REST mock: mockShopData" --body "Page/functionality: Shop/store listing and product details. Replace `mockShopData` with the real shop API wrapper or adapter before removal." --label cleanup
```

```
gh issue create --title "Remove REST mock: mockDailyAffirmation" --body "Page/functionality: Daily Affirmation widget shown on dashboard/home. Replace with `requests/affirmations` or server call returning today's affirmation." --label cleanup
```

```
gh issue create --title "Remove REST mock: mockDailyTip" --body "Page/functionality: Daily Tip widget used on dashboard/home. Replace with real tips API call before removing the mock." --label cleanup
```

```
gh issue create --title "Remove REST mock: mockExercisesRecoveryData" --body "Page/functionality: Quick exercises / recovery exercises list used in Guide and Exercises sections. Ensure `requests/exercises` covers this data shape and update usages before deletion." --label cleanup
```

```
gh issue create --title "Remove REST mock: mockAffirmations" --body "Page/functionality: Affirmations listing page and admin tools. Replace with `requests/affirmations` or server fetches and adjust tests if needed." --label cleanup
```

```
gh issue create --title "Remove REST mock: mockTips" --body "Page/functionality: Tips listing page and admin tools. Replace with `requests/tips` or server fetches and update tests accordingly." --label cleanup
```

```
gh issue create --title "Remove REST mock: mockMoodCounts" --body "Page/functionality: Mood tracker statistics (counts) used on statistics/dashboard. Ensure real analytics endpoints or aggregate queries replace this mock." --label cleanup
```

```
gh issue create --title "Remove REST mock: mockAchievements" --body "Page/functionality: Achievements UI and related progress indicators. Replace mock with `requests/achievements` or backend data and update components." --label cleanup
```

```
gh issue create --title "Remove REST mock: mockBestDay" --body "Page/functionality: Best day metric shown in statistics. Replace with proper `requests/stats` endpoint before removal." --label cleanup
```

```
gh issue create --title "Remove REST mock: mockMoodMarks" --body "Page/functionality: Mood marks distribution (chart data) used in statistics pages. Ensure real endpoints replace the mock." --label cleanup
```

```
gh issue create --title "Remove REST mock: mockStressLevel" --body "Page/functionality: Stress level metric on dashboard/statistics. Replace with real metric endpoint before deletion." --label cleanup
```

```
gh issue create --title "Remove REST mock: mockTodayObservations" --body "Page/functionality: Today's observations/insights shown on dashboard. Replace with `requests/observations` or similar backend data source before removing mock." --label cleanup
```
