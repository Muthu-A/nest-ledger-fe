const { defineConfig } = require('cypress')

module.exports = defineConfig({
  e2e: {
    baseUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
    specPattern: 'cypress/e2e/**/*.cy.js',
    supportFile: false,
    video: false,
  },
})
