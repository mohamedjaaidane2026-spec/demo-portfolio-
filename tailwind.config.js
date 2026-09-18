/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Near-monochrome neutrals; one accent, used sparingly.
        base: {
          900: '#0a0a0b',
          850: '#101012',
          800: '#16161a',
          750: '#1d1d22',
          700: '#26262c',
          600: '#34343c',
        },
        fg: {
          DEFAULT: '#e9e9ec',
          dim: '#a0a0a9',
          mute: '#6f6f79',
        },
        accent: {
          DEFAULT: '#d83a45',
          hover: '#e45560',
          dim: '#7c2128',
        },
      },
      fontFamily: {
        sans: [
          'Inter',
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          'Segoe UI',
          'Roboto',
          'sans-serif',
        ],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
      fontSize: {
        '2xs': ['0.6875rem', { lineHeight: '1rem' }],
      },
      borderRadius: {
        DEFAULT: '0.25rem',
        md: '0.3125rem',
        lg: '0.375rem',
      },
      maxWidth: {
        shell: '1560px',
      },
    },
  },
  plugins: [],
}
