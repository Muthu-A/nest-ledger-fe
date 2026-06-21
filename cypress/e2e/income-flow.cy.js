describe('Add Income flow', () => {
  it('adds income and updates totals', () => {
    cy.visit('/dashboard')
    cy.get('[data-cy=add-income-btn]').click()
    cy.get('[data-cy=amount-input]').type('5000')
    cy.get('[data-cy=category-select]').select('salary')
    cy.get('[data-cy=submit-btn]').click()
    cy.get('[data-cy=total-income]').should('contain', '5,000')
  })
})