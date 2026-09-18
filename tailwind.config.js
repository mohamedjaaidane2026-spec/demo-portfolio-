/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          950: '#080b14',
          900: '#0c101c',
          850: '#111726',
          800: '#161d30',
          700: '#1f2941',
          600: '#2b3755',
          500: '#3d4b6e',
        },
        mist: {
          100: '#eef2fb',
          300: '#c3ccE3',
          400: '#9aa6c4',
          500: '#7b88a8',
        },
        teal: {
          300: '#6fe3d2',
          400: '#38cfba',
          500: '#17b6a0',
          600: '#0f9384',
        },
        amber: {
          300: '#f7d07a',
          400: '#efb544',
        },
      },
      fontFamily: {
        sans: ['Inter var', 'Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['"Playfair Display"', 'Georgia', 'serif'],
      },
      boxShadow: {
        lift: '0 18px 48px -16px rgba(4, 8, 18, 0.85)',
        glow: '0 0 0 1px rgba(56, 207, 186, 0.35), 0 12px 40px -12px rgba(23, 182, 160, 0.45)',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.45' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.5s ease-out both',
        'fade-in': 'fade-in 0.4s ease-out both',
        'pulse-soft': 'pulseSoft 2.4s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
