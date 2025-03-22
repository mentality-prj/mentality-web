/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable {
    loginByGoogleApi(): void
  }
}
