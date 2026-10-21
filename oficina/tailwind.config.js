/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './App.tsx',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        // paleta salmão / laranja
        brand: {
          50: '#FFF5F2',
          100: '#FFE8E0',
          200: '#FFD0C0',
          300: '#FFB199',
          400: '#FF9473',
          500: '#F97E5B',
          600: '#EA6341',
          700: '#C94B2C',
        },
        canvas: '#FFF8F5',
        ink: '#3B2A25',
        muted: '#8A7A74',
        line: '#F1DDD5',
      },
    },
  },
  plugins: [],
};
