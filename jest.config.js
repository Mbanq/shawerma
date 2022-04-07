const config = {
  verbose: true,
  collectCoverage: true,
  coverageReporters: [
    'text',
    'text-summary',
    'cobertura'
  ],
  coverageThreshold: {
    global: {
      statements: 98,
      branches: 87,
      functions: 92,
      lines: 99
    }
  },
  projects: [
    {
      displayName: 'Unit Tests',
      testMatch: [
        '**/__tests__/**/?(*.)+(spec|test).+(ts|js)',
        '!**/__tests__/mocks/**',
        '!**/__tests__/events/**'
      ],
      transform: {
        '^.+\\.(ts|tsx)$': 'ts-jest'
      }
    }
  ]
};

module.exports = config;
