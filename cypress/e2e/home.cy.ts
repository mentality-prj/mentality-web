describe('Home Page', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('should display the Next.js logo', () => {
    cy.get('img[alt="Next.js logo"]').should('exist')
  })

  it('should have the correct list items', () => {
    cy.get('ol').within(() => {
      cy.get('li').should('have.length', 2)
      cy.get('li').first().contains('Get started by editing app/page.tsx.')
      cy.get('li').last().contains('Save and see your changes instantly.')
    })
  })

  it('should have "Deploy now" button and link', () => {
    cy.get('a')
      .contains('Deploy now')
      .should('exist')
      .and(
        'have.attr',
        'href',
        'https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app'
      )
  })

  it('should have "Read our docs" button and link', () => {
    cy.get('a')
      .contains('Read our docs')
      .should('exist')
      .and(
        'have.attr',
        'href',
        'https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app'
      )
  })

  it('should have footer links', () => {
    cy.get('footer a').should('have.length', 3)
  })
})
