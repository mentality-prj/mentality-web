describe('Internationalization', () => {
  it('Must contain the default text in Ukrainian', () => {
    cy.visit('/')
    cy.get('div').contains('Translate: Текст для тесту').should('exist')
  })
  it('User can change the language', () => {
    cy.visit('/')
    cy.get('select[data-test="language-select"]').should('exist').select('English')
    cy.get('div').contains('Translate: Text for the test').should('exist')
    cy.get('select[data-test="language-select"]').should('exist').select('Polish')
    cy.get('div').contains('Translate: Tekst testu').should('exist')
  })
})
