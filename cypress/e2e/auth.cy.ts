describe('Authorization', () => {
  beforeEach(() => {
    cy.visit('/')
  })
  it('SignIn page', () => {
    cy.get('a').contains('Login').should('exist').click()
    cy.get('h1').contains('SignIn')
    cy.get('button').contains('Sign in with Google').should('exist')
    cy.get('button').contains('Sign in with Github').should('exist')
  })
  it('Middlevare', () => {
    cy.visit('/profile')
    cy.get('h1').contains('SignIn')
    cy.get('button').contains('Sign in with Google').should('exist')
    cy.get('button').contains('Sign in with Github').should('exist')
  })
})
