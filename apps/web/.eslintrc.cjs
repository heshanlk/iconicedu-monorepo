module.exports = {
  root: false,
  extends: ['next/core-web-vitals', '../../packages/config-eslint/index.cjs'],
  parserOptions: {
    project: ['./tsconfig.json'],
    tsconfigRootDir: __dirname,
  },
};
