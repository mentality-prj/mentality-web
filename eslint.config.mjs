import { defineConfig, globalIgnores } from 'eslint/config'
import nextVitals from 'eslint-config-next/core-web-vitals'
import nextTypescript from 'eslint-config-next/typescript'
import prettier from 'eslint-config-prettier'
import security from 'eslint-plugin-security'
import simpleImportSort from 'eslint-plugin-simple-import-sort'

export default defineConfig([
  ...nextVitals,
  ...nextTypescript,
  security.configs.recommended,
  {
    files: ['**/*.{js,jsx,ts,tsx,mjs}'],
    plugins: {
      security,
      'simple-import-sort': simpleImportSort,
    },
    rules: {
      // Preserve the existing source-order convention from .eslintrc.json.
      'simple-import-sort/imports': [
        'error',
        {
          groups: [
            ['^react', '^@?\\w'],
            ['^(@|components)(/.*|$)'],
            ['^\\u0000'],
            ['^\\.\\.(?!/?$)', '^\\.\\./?$'],
            ['^\\./(?=.*/)(?!/?$)', '^\\.(?!/?$)', '^\\./?$'],
            ['^.+\\.?(css)$'],
          ],
        },
      ],
      'simple-import-sort/exports': 'error',
      'import/first': 'error',
      'import/newline-after-import': 'error',
      'import/no-duplicates': 'error',
      'no-restricted-globals': ['error', { name: 'fetch', message: 'Use apiTransport for HTTP API calls.' }],
      'react/jsx-no-target-blank': ['error', { enforceDynamicLinks: 'always' }],
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-require-imports': 'off',
      '@typescript-eslint/ban-ts-comment': 'off',
      'react-hooks/set-state-in-effect': 'off',
      'react-hooks/immutability': 'off',
      'react-hooks/purity': 'off',
      'react-hooks/refs': 'off',
      'react-hooks/static-components': 'off',
      '@next/next/no-html-link-for-pages': 'warn',
      '@next/next/no-location-assign-relative-destination': 'warn',
      'security/detect-object-injection': 'warn',
      'no-eval': 'error',
      'no-implied-eval': 'error',
      'no-unsafe-optional-chaining': 'error',
    },
  },
  { files: ['lib/api/transport.ts', 'scripts/**/*.{js,mjs}'], rules: { 'no-restricted-globals': 'off' } },
  prettier,
  globalIgnores(['.next/**', '.next-docs/**', 'node_modules/**', 'coverage/**', '.github/**']),
])
