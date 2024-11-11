describe('Internationalization', () => {
  it('Must contain the original text in English', () => {
    cy.visit('/')
    cy.get('div').contains('Translate: Hello world!').should('exist')
  })
  it('User can change the language', () => {
    cy.visit('/')
    cy.get('select[data-test="language-select"]').should('exist').select('Indonesian')
    cy.get('div').contains('Translate: Halo dunia!').should('exist')
  })
})
