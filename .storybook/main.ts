import type { StorybookConfig } from '@storybook/nextjs'

const config: StorybookConfig = {
  stories: ['../stories/**/*.mdx', '../stories/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: [
    '@storybook/addon-onboarding',
    '@storybook/addon-essentials',
    '@chromatic-com/storybook',
    '@storybook/addon-interactions',
    '@storybook/addon-designs',
  ],
  framework: {
    name: '@storybook/nextjs',
    options: {},
  },
  docs: {
    defaultName: 'Documentation',
  },
}
export default config
