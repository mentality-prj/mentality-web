import { defineConfig, globalIgnores } from 'eslint/config'
import nextVitals from 'eslint-config-next/core-web-vitals'
import nextTypescript from 'eslint-config-next/typescript'
import prettier from 'eslint-config-prettier'
import simpleImportSort from 'eslint-plugin-simple-import-sort'

export default defineConfig([
  ...nextVitals,
  ...nextTypescript,
  {
    files: ['**/*.{js,jsx,ts,tsx,mjs}'],
    plugins: {
      'simple-import-sort': simpleImportSort,
    },
    rules: {
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error',
      'no-eval': 'error',
      'no-implied-eval': 'error',
      'no-unsafe-optional-chaining': 'error',
    },
  },
  prettier,
  globalIgnores(['.next/**', '.next-docs/**', 'node_modules/**', 'coverage/**']),
])
