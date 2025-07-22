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
        primary: '#ffc400',
        secondary: '#5e4ae3',
        'text-dark': '#333333',
        'text-body': '#444444',
        'text-heading': '#222222',
        background: {
          light: '#fff9ec',
          white: '#ffffff',
        },
        'footer-bg': '#f5f5f5',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        body: '16px',
      },
    },
  },
  plugins: [],
} 