import js from '@eslint/js';
import tseslint from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const base = {
  ignores: ['**/node_modules/**', '**/dist/**', '**/.next/**'],
  languageOptions: {
    parser: tsParser,
    parserOptions: {
      ecmaVersion: 2020,
      sourceType: 'module',
    },
  },
  plugins: {
    '@typescript-eslint': tseslint,
    react,
    'react-hooks': reactHooks,
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
  rules: {
    ...js.configs.recommended.rules,
    ...tseslint.configs.recommended.rules,
    ...react.configs.recommended.rules,
    ...reactHooks.configs.recommended.rules,
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    'react/react-in-jsx-scope': 'off',
  },
};

const withProject = (pattern, tsconfigPath) => ({
  ...base,
  files: Array.isArray(pattern) ? pattern : [pattern],
  languageOptions: {
    ...base.languageOptions,
    parserOptions: {
      ...base.languageOptions.parserOptions,
      project: tsconfigPath,
      tsconfigRootDir: path.dirname(tsconfigPath),
    },
  },
});

export default [
  {
    ignores: ['**/node_modules/**', '**/.next/**', '**/dist/**'],
  },
  withProject(['**/*.{ts,tsx,js,jsx}'], path.join(__dirname, 'tsconfig.json')),
  withProject(
    ['apps/web/**/*.{ts,tsx,js,jsx}'],
    path.join(__dirname, 'apps/web/tsconfig.json')
  ),
  withProject(
    ['apps/api/**/*.{ts,tsx,js,jsx}'],
    path.join(__dirname, 'apps/api/tsconfig.json')
  ),
  withProject(
    ['packages/ui-web/**/*.{ts,tsx,js,jsx}'],
    path.join(__dirname, 'packages/ui-web/tsconfig.json')
  ),
  withProject(
    ['packages/ui-native/**/*.{ts,tsx,js,jsx}'],
    path.join(__dirname, 'packages/ui-native/tsconfig.json')
  ),
  withProject(
    ['packages/utils/**/*.{ts,tsx,js,jsx}'],
    path.join(__dirname, 'packages/utils/tsconfig.json')
  ),
  withProject(
    ['packages/shared-types/**/*.{ts,tsx,js,jsx}'],
    path.join(__dirname, 'packages/shared-types/tsconfig.json')
  ),
];
