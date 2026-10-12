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
}

// next/jest builds its own node_modules ignore rules. Override the *resolved*
// config, not the input config, to transpile ESM-only next-intl v4.
export default async () => {
  const nextConfig = await createJestConfig(config)()
  return {
    ...nextConfig,
    transformIgnorePatterns: ['/node_modules/(?!(next-intl|use-intl|intl-messageformat|@formatjs)/)'],
    transform: {
      '^.+/node_modules/(next-intl|use-intl|intl-messageformat|@formatjs)/.+\\.m?js$': [
        'babel-jest',
        { presets: ['next/babel'] },
      ],
      ...nextConfig.transform,
    },
  }
}
