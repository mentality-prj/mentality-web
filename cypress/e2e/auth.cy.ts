describe('OAuth', function () {
  it('OAuth Google', function () {
    cy.loginByGoogleApi()
  })

  it('OAuth GitHub', () => {
    cy.visit('/')
    cy.get('a').contains('Sign In').should('exist').click()
    cy.contains('button', 'Signin with GitHub', { timeout: 10000 })
    cy.get('button').contains('Signin with GitHub').should('exist').should('be.visible').click()

    cy.visit(
      'https://github.com/login?client_id=Ov23liezSMqaZLQWyxQb&return_to=%2Flogin%2Foauth%2Fauthorize%3Fclient_id%3DOv23liezSMqaZLQWyxQb%26code_challenge%3DtTPUn3MMvcmFr3F_mcK6Gl6jfw5jt5juNGwEoE4_xGo%26code_challenge_method%3DS256%26redirect_uri%3Dhttp%253A%252F%252Flocalhost%253A3000%252Fapi%252Fauth%252Fcallback%252Fgithub%26response_type%3Dcode%26scope%3Dread%253Auser%2Buser%253Aemail'
    )
    cy.origin('https://github.com', () => {
      cy.get('input[name="login"]').type('testovazapus123@gmail.com')
      cy.get('input[name="password"]').type('test_123Password')
      cy.get('input[name="commit"]').contains('Sign in').should('exist').click()
    })

    cy.visit('/')
  })
})
