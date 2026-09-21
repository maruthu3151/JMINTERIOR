/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        wood: {
          50: '#FAF6F0',
          100: '#F4EDE2',
          200: '#E8D9C5',
          300: '#D5BE9E',
          400: '#BD9E72',
          500: '#A4804E',
          600: '#8A663A',
          700: '#6E4E2C',
          800: '#553B22',
          900: '#3D2A18',
        },
        gold: {
          400: '#D4AF37',
          500: '#C5A028',
          600: '#A68218',
        }
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"Inter"', 'system-ui', '-apple-system', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
