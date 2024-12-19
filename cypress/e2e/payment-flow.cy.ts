describe('Payment flow', () => {
  it('Payment flow', () => {
    cy.visit('/cart')
    cy.contains('button', '+').should('exist').click()
    cy.contains('button', '-').should('exist').click()
    cy.contains('button', '+').should('exist').click()

    cy.contains('button', 'Proceed to Checkout').should('exist').click()

    //Delivery-details form
    cy.get('input[name="fullName"]').click().type('Test string')
    cy.get('input[name="city"]').click().type('Київ')
    cy.contains('button', 'м. Київ, Київська обл.').should('exist').click()
    cy.get('input[name="city"]').should('have.value', 'м. Київ, Київська обл.')
    cy.get('input[name="deliveryMethod"][value="courier-delivery"]').click()
    cy.get('input[name="deliveryMethod"][value="courier-delivery"]').should('be.checked')
    cy.get('div').contains('mm').click().type('12122040')
    cy.get('button').contains('Submit').click()

    //Payment-info form
    cy.get('input[name="cardNumber"]').click().type('1234567812345678')
    cy.contains('button', 'select month').should('exist').click()
    cy.contains('span', '01').should('exist').click()
    cy.contains('button', 'select year').should('exist').click()
    cy.contains('span', '2028').should('exist').click()
    cy.get('input[name="cvv"]').click().type('123')
    cy.get('button').contains('Submit').click()

    //Review form
    cy.contains('p', 'full name:').should('exist', { timeout: 10000 })
    cy.contains('p', 'card number: 1234 5678 1234 5678').should('exist', { timeout: 10000 })
    cy.contains('p', 'city: м. Київ, Київська обл.').should('exist', { timeout: 10000 })
    cy.contains('p', 'cvv: 123').should('exist', { timeout: 10000 })
    cy.contains('p', 'delivery date: 2040-12-12').should('exist', { timeout: 10000 })
    cy.contains('p', 'delivery method: courier-delivery').should('exist', { timeout: 10000 })
    cy.contains('p', 'expiration date: 01/28').should('exist', { timeout: 10000 })

    cy.contains('button', 'Confirm').should('exist', { timeout: 10000 }).click()

    //Thanks page
    cy.contains('div', 'Thanks for your order').should('exist', { timeout: 10000 })
  })
})
