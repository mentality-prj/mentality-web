# Автентифікація та браузерний BFF

## Поточна архітектура

Dzvin.co використовує Zitadel (Authorization Code + PKCE), Next.js 16 App Router і NestJS. Сервер зберігає токени доступу, ID та оновлення в HttpOnly cookie `auth-tokens`. Браузер отримує тільки перевірені відомості про користувача й метадані терміну дії токена.

**Не використовуйте браузерний `getToken()` для отримання JWT і не додавайте `Authorization` у React-запити.** Застарілий `getToken()` навмисно повертає `null`. Токени Zitadel та привілейовані ключі QDIP/DIP не мають потрапляти до клієнтського стану.

## Вхід і сесія

1. `ZitadelAuthProvider.login()` генерує PKCE verifier/challenge та state і переводить браузер до Zitadel.
2. `/callback` перевіряє state і надсилає код та verifier на `POST /api/auth/exchange`.
3. Next.js обмінює код із серверним секретом Zitadel та встановлює HttpOnly cookie (SameSite=Lax, Secure у production). JSON містить лише метадані.
4. `GET /api/auth/session` повертає користувача, перевіреного через NestJS, без JWT.
5. `GET /api/auth/token` повертає метадані. `POST /api/auth/token` відхиляє довільні браузерні JWT.
6. `POST /api/auth/exchange` з `grantType: 'refresh_token'` оновлює токени на сервері; `POST /api/auth/logout` очищує cookie й переводить до Zitadel.

Провайдер дедуплікує refresh у межах одного екземпляра. **Одночасний refresh у кількох вкладках і на сервері ще потребує реального E2E** (issue #439).

## Авторизовані API-запити

Використовуйте `performAuthRequest()` або `apiRequest()` із браузерною сесією та налаштованим URL NestJS. Helper переводить браузерний запит на `/api/backend/*` того самого origin. Next.js перевіряє cookie через NestJS і додає перевірений bearer **лише між серверами**. Клієнтські bearer, cookie та привілейовані ключі API відхиляються.

Приклад:

```ts
import { performAuthRequest } from '@/requests/genericFetch'
import { APIUrl } from '@/requests/config'

const result = await performAuthRequest(session, APIUrl + '/mood-record', { method: 'GET' })
```

Серверні компоненти можуть звертатися до NestJS безпосередньо з перевіреною серверною сесією. BFF забезпечує `no-store`, перевіряє origin мутацій, обмежує розмір тіла та дозволені маршрути. API даних `GET /auth/me` та `GET/PATCH /auth/me/analytics-preferences` доступні; маршрути перевірки токенів і провайдера — ні.

## Основні файли

- `lib/auth/providers/zitadel.ts` — PKCE та клієнтська сесія
- `context/AuthProvider.tsx` — дані користувача та розклад refresh
- `lib/auth/server.ts` — перевірка серверної сесії з timeout
- `app/api/auth/{exchange,session,token,logout}/route.ts` — серверна авторизація
- `app/api/backend/[...path]/route.ts` — BFF до NestJS
- `helpers/api-wrapper.ts` — BFF-транспорт і фільтр credential-заголовків
- `proxy.ts` — маршрутизація та заголовки безпеки Next.js 16

`ZITADEL_CLIENT_SECRET` — тільки серверний секрет. Публічні параметри: `NEXT_PUBLIC_ZITADEL_ISSUER`, `NEXT_PUBLIC_ZITADEL_CLIENT_ID`, `NEXT_PUBLIC_BASE_URL`. URL NestJS: `NEXT_PUBLIC_API_URL`.

## Критерії випуску

PR #437 інтегровано до `dev` після TypeScript, ESLint, Prettier, Jest, smoke-тестів та build. **Production ще не кваліфіковано.** Реальний E2E на ізольованих тестових Zitadel/NestJS має підтвердити login/callback, конкурентний refresh, logout, права доступу, міжтенантну ізоляцію та відсутність JWT у браузері (issue #439).

Див. `DOCS/frontend-architecture.md` та issues #436, #438, #439.
