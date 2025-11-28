import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx,mdx}',
    './components/**/*.{ts,tsx}',
    '../../packages/ui-web/src/**/*.{ts,tsx}',
  ],
};

export default config;
