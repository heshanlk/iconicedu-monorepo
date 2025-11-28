/**
 * Shared Jest preset for monorepo packages and apps.
 * Uses SWC for fast TypeScript/JSX transforms and keeps ESM resolution enabled.
 */

const path = require('path');

/** @type {import('jest').Config} */
module.exports = {
  testEnvironment: 'node',
  transform: {
    '^.+\\.(t|j)sx?$': ['@swc/jest'],
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  moduleNameMapper: {
    '^@iconicedu/(.*)$': path.join(__dirname, '..', '$1', 'src'),
  },
  setupFilesAfterEnv: [],
};
