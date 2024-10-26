import { defineConfig } from 'cypress'
import * as dotenv from 'dotenv'

dotenv.config()

const cypressConfig = defineConfig({
  e2e: {
    baseUrl: process.env.CYPRESS_BASE_URL,
    setupNodeEvents(on: Cypress.PluginEvents, config: Cypress.PluginConfigOptions) {
      console.log('on', on)

      return config
    },
  },
})

export default cypressConfig
