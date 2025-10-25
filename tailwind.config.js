/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'ios-blue': '#007AFF',
        'ios-gray': '#F2F2F7',
        'ios-dark': '#1C1C1E',
      },
      fontFamily: {
        'sf': ['-apple-system', 'BlinkMacSystemFont', 'SF Pro Display', 'Segoe UI', 'sans-serif'],
      },
      borderRadius: {
        'ios': '10px',
        'ios-card': '16px',
      },
      boxShadow: {
        'ios': '0 2px 10px rgba(0, 0, 0, 0.1)',
      }
    },
  },
  plugins: [],
}
