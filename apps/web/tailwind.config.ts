import type { Config } from 'tailwindcss';
import colors from 'tailwindcss/colors';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    '../../packages/ui-web/src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        slate: colors.slate,
        brand: {
          50: '#f5f7ff',
          100: '#e0e7ff',
          500: '#4f46e5',
          600: '#4338ca',
          700: '#3730a3',
        },
      },
      borderRadius: {
        xl: '0.75rem',
        '2xl': '1rem',
      },
    },
  },
  plugins: [],
};

export default config;
