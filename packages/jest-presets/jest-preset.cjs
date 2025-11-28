/** Shared Jest preset for Iconic EDU packages */
module.exports = {
  testEnvironment: 'node',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  transform: {
    '^.+\\.(t|j)sx?$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.json' }],
  },
  globals: {
    'ts-jest': {
      isolatedModules: true,
    },
  },
};
