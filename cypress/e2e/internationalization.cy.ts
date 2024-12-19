describe('Internationalization', () => {
  it('User can change the language', () => {
    cy.visit('/')
    cy.contains('button', 'uk').should('exist', { timeout: 10000 }).click()
    cy.wait(10000)
    cy.contains('li[data-key="en"]', 'en').should('exist', { timeout: 10000 }).click()
    cy.url().should('include', '/en')
    cy.contains('button', 'en').should('exist', { timeout: 10000 }).click()

    cy.contains('li[data-key="pl"]', 'pl').should('exist', { timeout: 10000 }).click()
    cy.url().should('include', '/pl')
    cy.contains('button', 'pl').should('exist')
  })
})
