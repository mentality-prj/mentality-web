import { spawnSync } from 'node:child_process'

const files = [
  'app/[locale]/(protected)/mood-tracker/page.tsx',
  'app/api/auth/logout/route.test.ts',
  'app/api/auth/token/route.test.ts',
  'app/api/backend/[...path]/route.test.ts',
  'app/api/backend/[...path]/route.ts',
  'context/AuthProvider.tsx',
  'DOCS/framework-upgrade-gate.md',
  'DOCS/frontend-architecture.md',
  'features/company/reporting/README.md',
  'lib/auth/providers/zitadel.ts',
  'lib/backend/path.ts',
  'requests/auth.test.ts',
  'helpers/api-wrapper.test.ts',
  'helpers/api-wrapper.ts',
  'helpers/API_WRAPPER_GUIDE.md',
  'app/api/auth/exchange/route.test.ts',
  'app/api/auth/session/route.test.ts',
  'features/mood/README.md',
  'features/research/README.md',
]

for (const path of files) {
  const result = spawnSync('./node_modules/.bin/prettier', [path], {
    encoding: 'utf8',
    maxBuffer: 8_000_000,
  })
  if (result.status !== 0) {
    throw new Error(`Prettier failed for ${path}: ${result.stderr}`)
  }
  process.stdout.write(`FMT_SNAPSHOT:${JSON.stringify({ path, content: result.stdout })}\n`)
}
