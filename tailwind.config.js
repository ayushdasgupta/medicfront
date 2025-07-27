/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backdropBlur: {
        xs: '2px',
      },
      colors: {
        primary: '#4F46E5', // Customize as needed
        accent: '#06b6d4',
        customIndigo: '#667eea',
        customPurple: '#764ba2',
      },
    },
  },
  plugins: [],
  darkMode:'class'
}

