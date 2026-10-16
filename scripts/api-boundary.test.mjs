import assert from 'node:assert/strict'
import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { join, relative, resolve } from 'node:path'
import { test } from 'node:test'
import ts from 'typescript'

// A public browser must make application data requests through the single
// same-origin API transport. These are infrastructure/server-only exceptions,
// never alternative client APIs.
const permittedTransports = new Set([
  'helpers/api-wrapper.ts',
  'requests/auth.ts', // only same-origin /api/auth/* identity lifecycle
  'requests/dipClient.ts', // server-only NestJS QDIP administration adapter
  'lib/auth/server.ts', // server-side NestJS Zitadel token validation
  'lib/auth/companyBackend.server.ts', // reviewed server-only membership and active-company verification
  'proxy.ts', // server-side refresh handoff
  'app/api/backend/[...path]/route.ts', // one NestJS BFF entrypoint
  'app/api/auth/exchange/route.ts', // Zitadel token exchange, server-only
  // One-time, admin-only HttpOnly key-flash response; cannot be sent via the
  // generic NestJS BFF without exposing an API key to the wrong audience.
  'components/features/Dip/ApiKeyFlashBanner.tsx',
])

const sourceRoots = ['app', 'components', 'context', 'features', 'helpers', 'hooks', 'lib', 'requests', 'actions', 'ui']
const rootDir = resolve(import.meta.dirname, '..')

function listCodeFiles(dir) {
  if (!existsSync(dir)) return []
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name)
    if (entry.isDirectory()) return listCodeFiles(path)
    if (!/\.(ts|tsx|js|jsx)$/.test(path) || /\.(test|spec|d)\.[jt]sx?$/.test(path)) return []
    return [path]
  })
}

function isDirectFetch(call) {
  const callee = call.expression
  if (ts.isIdentifier(callee)) return callee.text === 'fetch'
  if (ts.isPropertyAccessExpression(callee) && callee.name.text === 'fetch') {
    return ts.isIdentifier(callee.expression) && ['window', 'globalThis', 'global'].includes(callee.expression.text)
  }
  return false
}

test('one client API: no ad-hoc global fetch outside reviewed transports', () => {
  const paths = [...sourceRoots.flatMap((name) => listCodeFiles(join(rootDir, name))), join(rootDir, 'proxy.ts')]
  const violations = []

  for (const path of paths) {
    if (!existsSync(path)) continue
    const rel = relative(rootDir, path).replaceAll('\\', '/')
    if (permittedTransports.has(rel)) continue
    const text = readFileSync(path, 'utf8')
    const source = ts.createSourceFile(rel, text, ts.ScriptTarget.Latest, true)
    const visit = (node) => {
      if (ts.isCallExpression(node) && isDirectFetch(node)) {
        const { line } = source.getLineAndCharacterOfPosition(node.getStart(source))
        violations.push(rel + ':' + (line + 1))
      }
      ts.forEachChild(node, visit)
    }
    visit(source)
  }

  assert.deepEqual(
    violations,
    [],
    'Use apiRequest/publicApiRequest or a reviewed server-only adapter; direct fetch found:'
  )
})

test('QDIP administrator client remains server-only', () => {
  const clientImports = []
  for (const dir of sourceRoots.flatMap((name) => listCodeFiles(join(rootDir, name)))) {
    const path = relative(rootDir, dir).replaceAll('\\', '/')
    const code = readFileSync(dir, 'utf8')
    if (/^['"]use client['"]/m.test(code.slice(0, 60)) && code.includes('@/requests/dipClient')) {
      clientImports.push(path)
    }
  }
  assert.deepEqual(clientImports, [])
})

test('Zitadel validation is not a second browser-accessible NestJS API', () => {
  const auth = readFileSync(join(rootDir, 'requests/auth.ts'), 'utf8')
  assert.doesNotMatch(auth, /\/auth\/validate-token/)
  const contact = readFileSync(join(rootDir, 'requests/contact.ts'), 'utf8')
  assert.match(contact, /publicApiRequest\('\/contact'/)
  assert.doesNotMatch(contact, /\bAPIUrl\b/)
})

test('QDIP administration may only reach NestJS, without upstream platform credentials', () => {
  const client = readFileSync(join(rootDir, 'requests/dipClient.ts'), 'utf8')
  const actions = readFileSync(join(rootDir, 'app/[locale]/admin/dip/system/actions.ts'), 'utf8')
  assert.match(client, /import ['"]server-only['"]/)
  assert.match(client, /['"]\/dip-admin['"]/)
  assert.doesNotMatch(client, /process\.env\.(?:DIP_URL|DIP_API_KEY|DIP_ADMIN_API_KEY)/)
  assert.doesNotMatch(client, /['"]X-Api-Key['"]/)
  assert.doesNotMatch(client, /\/api\/v1\/(?:organizations|audit|features|workflows)/)
  assert.doesNotMatch(actions, /\bfetch\s*\(/)
})

// Model modules contain pure transformation/domain logic, not data acquisition.
// Scan actual import/export declarations (including barrels), rather than
// matching filenames in comments or string literals.
function collectModelImports(source) {
  const paths = []
  const visit = (node) => {
    let moduleNode
    if (ts.isImportDeclaration(node) || ts.isExportDeclaration(node)) {
      moduleNode = node.moduleSpecifier
    } else if (ts.isCallExpression(node) && node.expression.kind === ts.SyntaxKind.ImportKeyword) {
      moduleNode = node.arguments[0]
    }

    if (moduleNode && ts.isStringLiteralLike(moduleNode)) {
      paths.push(moduleNode.text)
    }
    ts.forEachChild(node, visit)
  }
  visit(source)
  return paths
}

function isForbiddenModelTarget(target) {
  const path = target.replaceAll('\\', '/')
  return (
    /^(requests|app|components|context|hooks|actions|ui)(\/|$)/.test(path) ||
    (path.startsWith('features/') && /\/(api|hooks|ui)(\/|$)/.test(path))
  )
}

test('model boundaries recognize dynamic imports and directory barrels', () => {
  const code = "import '@/features/research/api'; export * from '../api';"
  const dynamicImport = "const load = () => import('@/requests/genericFetch')"
  const source = ts.createSourceFile('model.ts', code + dynamicImport, ts.ScriptTarget.Latest, true)
  const imports = collectModelImports(source)

  assert.equal(imports.length, 3)
  assert.equal(imports[0], '@/features/research/api')
  assert.equal(imports[1], '../api')
  assert.equal(imports[2], '@/requests/genericFetch')
  assert.equal(isForbiddenModelTarget('features\\research\\api\\index'), true)
  assert.equal(isForbiddenModelTarget('features/research/api'), true)
  assert.equal(isForbiddenModelTarget('requests'), true)
  assert.equal(isForbiddenModelTarget('features/research/model'), false)
})

test('Research and Reporting models do not depend on API or UI layers', () => {
  const modelRoots = ['features/research/model', 'features/company/reporting/model']
  const violations = []

  for (const modelRoot of modelRoots) {
    for (const file of listCodeFiles(join(rootDir, modelRoot))) {
      const filename = relative(rootDir, file).replaceAll('\\', '/')
      const source = ts.createSourceFile(filename, readFileSync(file, 'utf8'), ts.ScriptTarget.Latest, true)

      for (const specifier of collectModelImports(source)) {
        const target = specifier.startsWith('@/')
          ? specifier.slice(2)
          : specifier.startsWith('.')
            ? relative(rootDir, resolve(file, '..', specifier)).replaceAll('\\', '/')
            : null
        if (!target) continue

        if (isForbiddenModelTarget(target)) {
          violations.push(filename + ' -> ' + specifier)
        }
      }
    }
  }

  assert.deepEqual(violations, [], 'Domain model imports must point inward, not to transport or UI layers')
})
