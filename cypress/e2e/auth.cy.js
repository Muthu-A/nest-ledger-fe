describe('Auth flow', () => {
  it('registers a new user, logs in and logs out', () => {
    cy.visit('/')
    cy.get('[data-cy=signup-link]').click()
    cy.get('[data-cy=email-input]').type('test@example.com')
    cy.get('[data-cy=password-input]').type('Password123!')
    cy.get('[data-cy=signup-submit]').click()
    cy.contains('Verify').should('exist')

    // Login
    cy.get('[data-cy=login-link]').click()
    cy.get('[data-cy=email-input]').type('test@example.com')
    cy.get('[data-cy=password-input]').type('Password123!')
    cy.get('[data-cy=login-submit]').click()
    cy.url().should('include', '/dashboard')

    // Logout
    cy.get('[data-cy=logout-btn]').click()
    cy.url().should('not.include', '/dashboard')
  })
})