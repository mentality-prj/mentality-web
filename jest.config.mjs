import nextJest from 'next/jest.js'

const createJestConfig = nextJest({
  dir: './',
})

const config = {
  coverageProvider: 'v8',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  testPathIgnorePatterns: ['/node_modules/', '<rootDir>/cypress/'],
  moduleNameMapper: {
    '^@/admin/(.*)$': '<rootDir>/app/[locale]/admin/components/$1',
    '^@/(.*)$': '<rootDir>/$1',
  },
  // next-intl v4 and use-intl publish ESM; Jest must transpile these packages.
  transformIgnorePatterns: [
    '/node_modules/(?!(next-intl|use-intl|intl-messageformat|@formatjs)/)',
  ],
}

export default createJestConfig(config)
