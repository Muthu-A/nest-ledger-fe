describe('Calculations E2E', () => {
  it('adds multiple incomes and expenses and verifies totals', () => {
    cy.visit('/dashboard')
    // add income 2000
    cy.get('[data-cy=add-income-btn]').click()
    cy.get('[data-cy=amount-input]').type('2000')
    cy.get('[data-cy=category-select]').select('freelance')
    cy.get('[data-cy=submit-btn]').click()

    // add income 1500
    cy.get('[data-cy=add-income-btn]').click()
    cy.get('[data-cy=amount-input]').type('1500')
    cy.get('[data-cy=category-select]').select('salary')
    cy.get('[data-cy=submit-btn]').click()

    // add expenses 500 and 800
    cy.get('[data-cy=add-expense-btn]').click()
    cy.get('[data-cy=amount-input]').type('500')
    cy.get('[data-cy=category-select]').select('food')
    cy.get('[data-cy=submit-btn]').click()

    cy.get('[data-cy=add-expense-btn]').click()
    cy.get('[data-cy=amount-input]').type('800')
    cy.get('[data-cy=category-select]').select('bills')
    cy.get('[data-cy=submit-btn]').click()

    cy.get('[data-cy=total-income]').should('contain', '3,500')
    cy.get('[data-cy=total-expenses]').should('contain', '1,300')
    cy.get('[data-cy=remaining-balance]').should('contain', '2,200')
  })
})