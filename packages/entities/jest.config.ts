export default {
  displayName: 'entities',
  preset: '../../jest.preset.js',
  // For testing the layer Entites, we don't use browser-like environment, but NodeJS.
  testEnvironment: 'node',
  globals: {
    'ts-jest': {
      tsconfig: '<rootDir>/tsconfig.spec.json',
    },
  },
  transform: {
    '^.+\\.ts$': ['ts-jest'],
  },
  moduleFileExtensions: ['ts', 'js'],
  transformIgnorePatterns: [
    // '!node_modules/',
    // 'node_modules/(?!uuid)',
    // '/node_modules/(?!uuid/)',
  ],
  // transformIgnorePatterns: ['/node_modules/(?!uuid)'],
  moduleNameMapper: {
    // '^uuid$': require.resolve('uuid'),
  },
  coverageDirectory: '../../coverage/packages/entities',
};
