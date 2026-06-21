module.exports = {
  projects: [
    {
      displayName: 'unit',
      preset: 'ts-jest',
      testEnvironment: 'node',
      testMatch: ['**/src/tests/unit/**/*.test.(ts|js)'],
      transform: { '^.+\\.tsx?$': 'ts-jest' },
      moduleFileExtensions: ['ts', 'js', 'json', 'node'],
    },
    {
      displayName: 'integration',
      preset: 'ts-jest',
      testEnvironment: 'node',
      testMatch: ['**/src/tests/integration/**/*.test.(ts|js)'],
      setupFilesAfterEnv: ['<rootDir>/src/tests/setupTests.js'],
      transform: { '^.+\\.tsx?$': 'ts-jest' },
      moduleFileExtensions: ['ts', 'js', 'json', 'node'],
    },
  ],
}
