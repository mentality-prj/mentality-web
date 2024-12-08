describe('Internationalization', () => {
  it('User can change the language', () => {
    cy.visit('/')
    cy.contains('button', 'uk').should('exist').click()
    cy.get('li[data-key="en"]').should('exist').click()
    cy.contains('button', 'en').should('exist').click()
    cy.get('li[data-key="pl"]').should('exist').click()
    cy.contains('button', 'pl').should('exist')
  })
})
