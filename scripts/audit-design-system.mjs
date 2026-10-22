import { appendFileSync, existsSync, readdirSync, readFileSync } from 'node:fs'
import { join, relative } from 'node:path'

const root = process.cwd()
const roots = ['app', 'components', 'features']
const scanned = []
const rawTag = /<(button|input|textarea|select)(?=[\s>])/g
const dsImport = /from\s+['"]@\/(?:ds\/components\/|ui\/|components\/shared\/(?:Cards|Forms)\/)/

function visit(directory) {
  if (!existsSync(directory)) return
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name)
    if (entry.isDirectory()) {
      visit(path)
    } else if (
      entry.isFile() &&
      entry.name.endsWith('.tsx') &&
      !/\.(?:test|spec|stories)\.tsx$/.test(entry.name)
    ) {
      const text = readFileSync(path, 'utf8')
      const tags = [...text.matchAll(rawTag)].map((match) => match[1])
      const file = relative(root, path).replaceAll('\\', '/')
      scanned.push({
        file,
        hasDsImport: dsImport.test(text),
        rawButtons: tags.filter((tag) => tag === 'button').length,
        rawFields: tags.filter((tag) => tag !== 'button').length,
        manualCard: /rounded-(?:xl|2xl)[^\n"']*\bborder\b/.test(text) && /\bbg-(?:white|gray-|background)/.test(text),
      })
    }
  }
}
for (const directory of roots) visit(join(root, directory))

const total = (key) => scanned.reduce((sum, file) => sum + file[key], 0)
const candidates = scanned.filter((file) => file.rawButtons || file.rawFields || file.manualCard)
const ranking = [...candidates]
  .sort((a, b) => b.rawButtons * 2 + b.rawFields * 2 + Number(b.manualCard) -
    (a.rawButtons * 2 + a.rawFields * 2 + Number(a.manualCard)))
  .slice(0, 12)

const summary = [
  'Dzvin DS static inventory (heuristics, not an accessibility/visual certification)',
  `Production TSX scanned: ${scanned.length}`,
  `Files importing a DS control/card: ${scanned.filter((f) => f.hasDsImport).length}`,
  `Raw <button> tags: ${total('rawButtons')} across ${scanned.filter((f) => f.rawButtons).length} files`,
  `Raw input/textarea/select tags: ${total('rawFields')} across ${scanned.filter((f) => f.rawFields).length} files`,
  `Manually styled card candidates: ${scanned.filter((f) => f.manualCard).length}`,
  'These are review candidates: native controls may be legitimate and layout-only components need no DS import.',
  ...ranking.map((file) =>
    `  ${file.file}: buttons=${file.rawButtons}, fields=${file.rawFields}, cardCandidate=${file.manualCard}`
  ),
]
console.log(summary.join('\n'))

const required = [
  ['components/features/Guide/SafetyResources.tsx', /<SectionCard/, /<Button\b/, /href="tel:112"/],
  ['components/features/Diary/DiaryHistoryError.tsx', /<SectionCard/, /<Button\b/],
  ['components/features/Guide/QuickSupportCard.tsx', /<SectionCard/, /<Button\b/],
  ['app/[locale]/(protected)/diary/page.tsx', /<SafetyResources showDiaryPrivacy\s*\/>/],
  ['app/[locale]/(protected)/my-day/page.tsx', /<SafetyResources\s*\/>/],
]
let failed = false
for (const [file, ...patterns] of required) {
  const text = readFileSync(join(root, file), 'utf8')
  if (patterns.some((pattern) => !pattern.test(text))) {
    console.error(`P0 design-system/safety integration regression: ${file}`)
    failed = true
  }
}
if (process.env.GITHUB_STEP_SUMMARY) {
  appendFileSync(
    process.env.GITHUB_STEP_SUMMARY,
    '## Design system audit\n\n' + summary.slice(1, 7).map((line) => `- ${line}`).join('\n') + '\n'
  )
}
if (failed) process.exitCode = 1
