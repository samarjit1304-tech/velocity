/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0052FF', // Electric Blue
        orange: '#FF5A00', // Velocity Orange
        dark: '#0A0A0A', // Graphite Black
        charcoal: '#1E1E1E', // Deep Charcoal
        white: '#FFFFFF',
        lime: '#D6FF00', // Neon Lime
        red: '#FF003C', // Performance Red
        grey: {
          dark: '#333333',
          medium: '#666666',
          light: '#CCCCCC',
          extraLight: '#EAEAEA',
          silver: '#F5F5F7'
        },
        luxury: {
          dark: '#111111',
          grey: '#555555',
          lightGrey: '#EAEAEA',
          charcoal: '#1C1C1E',
          silver: '#F2F2F7',
          gold: '#D4AF37'
        }
      },
      fontFamily: {
        sans: ['Inter', 'Manrope', 'system-ui', 'sans-serif'],
        display: ['Space Grotesk', 'Satoshi', 'sans-serif'],
        serif: ['Playfair Display', 'Georgia', 'serif']
      },
      boxShadow: {
        premium: '0 4px 30px rgba(0, 0, 0, 0.05)',
        glass: '0 8px 32px 0 rgba(0, 82, 255, 0.08)',
        hover: '0 20px 40px rgba(0, 0, 0, 0.15)'
      },
      backdropBlur: {
        luxury: '16px'
      }
    },
  },
  plugins: [],
}
