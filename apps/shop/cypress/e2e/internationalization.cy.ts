describe('Internationalization', () => {
  it('User can change the language', () => {
    cy.visit('/')
    cy.wait(1000)
    cy.contains('button', 'uk').should('exist').click()
    cy.wait(1000)

    cy.contains('li[data-key="en"]', 'en').should('exist', { timeout: 10000 }).click()

    cy.url().should('include', '/en')
    cy.contains('button', 'en').should('exist', { timeout: 10000 }).click()

    cy.contains('li[data-key="pl"]', 'pl').should('exist', { timeout: 10000 }).click()
    cy.url().should('include', '/pl')
    cy.contains('button', 'pl').should('exist')
  })
})
