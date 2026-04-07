/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,ts,html}"
  ],
  theme: {
    extend: {
      colors: {
        primary: 'var(--sb-primary-color, #007bff)',
        secondary: 'var(--sb-secondary-color, #6c757d)',
      }
    },
  },
  plugins: [],
}
