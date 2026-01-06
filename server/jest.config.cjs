/** @type {import('jest').Config} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',

  testMatch: [
    '<rootDir>/src/**/*.test.ts',
    '<rootDir>/src/**/*.spec.ts',
  ],

  collectCoverage: true,
  collectCoverageFrom: [
    'src/services/product.service.ts',
    'src/services/store.service.ts',
    'src/repositories/store.repository.ts',
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],

  coverageThreshold: {
    global: {
      branches: 80,
      functions: 85,
      lines: 85,
      statements: 85,
    },
  },

  globals: {
    'ts-jest': {
      tsconfig: {
        module: 'CommonJS',
        target: 'ES2022',
        esModuleInterop: true,
        resolveJsonModule: true,
        isolatedModules: false,
        allowSyntheticDefaultImports: true,
      },
      diagnostics: true,
    },
  },
}
