/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
    '../../packages/ui-native/src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          500: '#4f46e5',
          600: '#4338ca',
          700: '#3730a3',
        },
      },
      borderRadius: {
        xl: 12,
        '2xl': 16,
      },
    },
  },
  plugins: [],
};
