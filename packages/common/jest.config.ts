export default {
  displayName: 'common',
  preset: '../../jest.preset.js',
  // For testing the layer Common, we don't use browser-like environment, but NodeJS.
  testEnvironment: 'node',
  globals: {
    'ts-jest': {
      tsconfig: '<rootDir>/tsconfig.spec.json',
    },
  },
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'js'],
  coverageDirectory: '../../coverage/packages/common',
};
