describe('Add Expense flow', () => {
  it('adds expense and updates totals', () => {
    cy.visit('/dashboard')
    cy.get('[data-cy=add-expense-btn]').click()
    cy.get('[data-cy=amount-input]').type('1500')
    cy.get('[data-cy=category-select]').select('groceries')
    cy.get('[data-cy=submit-btn]').click()
    cy.get('[data-cy=total-expenses]').should('contain', '1,500')
  })
})