describe('OAuth', function () {
  it('OAuth Google', function () {
    cy.loginByGoogleApi()
  })

  it('OAuth GitHub', () => {
    cy.visit('/')
    cy.get('a').contains('Sign In').should('exist').click()
    cy.get('button').contains('Signin with Github').should('exist').click()

    cy.origin('https://github.com', () => {
      cy.get('input[name="login"]').type('testovazapus123@gmail.com')
      cy.get('input[name="password"]').type('test_123Password')
      cy.get('input[name="commit"]').contains('Sign in').should('exist').click()
    })

    cy.visit('/')
  })
})
