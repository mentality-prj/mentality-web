describe('Home Page', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('should display the Logo', () => {
    cy.get('span').should('exist')
    cy.get('span').should('contain', 'Mentality')
  })
})
