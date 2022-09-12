export default {
  displayName: 'entities',
  preset: '../../jest.preset.js',
  // For testing the layer Entities,  Jest needs to load the browser environment, not the NodeJS environment.
  testEnvironment: 'jest-environment-jsdom',
  globals: {
    'ts-jest': {
      tsconfig: '<rootDir>/tsconfig.test.json',
    },
  },
  transform: {
    '^.+\\.ts$': ['ts-jest'],
  },
  moduleFileExtensions: ['ts', 'js'],
  coverageDirectory: '../../coverage/packages/entities',
};
