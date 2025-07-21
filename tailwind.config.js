/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#FACC15', // yellow-400
        secondary: '#15803D', // green-800
        background: '#FFFDF6',
        'background-alt': '#FDFCFB',
        text: {
          DEFAULT: '#0F172A', // slate-900
          secondary: '#475569', // slate-600
        }
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
} 