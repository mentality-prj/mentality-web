describe('Cart', () => {
  it('User can change quantity', () => {
    cy.visit('/shop/cart')
    cy.contains('button', '+').should('exist').click()
    cy.contains('button', '-').should('exist').click()
    cy.contains('button', '+').should('exist').click()
  })
})

describe('Delivery details form', () => {
  it('User can fill out the form', () => {
    cy.visit('/shop/delivery-details')
    cy.get('input[name="fullName"]').should('exist').click().type('Test string')
    cy.get('input[name="city"]').should('exist').click().type('Київ')
    cy.contains('button', 'м. Київ, Київська обл.').should('exist').click()
    cy.get('input[name="city"]').should('have.value', 'м. Київ, Київська обл.')
    cy.get('input[name="deliveryMethod"][value="courier-delivery"]').should('exist').click()
    cy.get('input[name="deliveryMethod"][value="courier-delivery"]').should('be.checked')
    cy.get('div').contains('mm').should('exist').click().type('12122040')
    cy.get('button').contains('Submit').should('exist').click()
  })
})

describe('Payment-info form', () => {
  it('User can fill out the form', () => {
    cy.visit('/shop/payment-info')
    cy.get('input[name="cardNumber"]').should('exist').click().type('1234567812345678')
    cy.get('button').contains('select month').should('exist').click()
    cy.wait(1000)
    cy.get('span').contains('01').should('exist').click()
    cy.wait(1000)

    cy.contains('button', 'select year').should('exist').click()
    cy.contains('span', '2028').should('exist').click()
    cy.wait(1000)
    cy.get('body').click(0, 1)

    cy.get('input[name="cvv"]').should('exist').click().type('123')
    cy.wait(500)
    cy.get('input[name="cvv"]').should('have.value', '123')
    cy.get('button').should('exist').contains('Submit').click()
  })
})
