/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'ui-sans-serif', 'system-ui', '-apple-system', '"Segoe UI"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', '"SFMono-Regular"', 'Menlo', 'monospace'],
      },
      colors: {
        brand: {
          DEFAULT: '#0F6E66',
          strong:  '#0B564F',
          soft:    '#ECF7F5',
          border:  '#A6DAD3',
        },
        teal: {
          50:  '#ECF7F5',
          100: '#D2EDE9',
          200: '#A6DAD3',
          300: '#6FC2B8',
          400: '#3DA398',
          500: '#1A857A',
          600: '#0F6E66',
          700: '#0B564F',
          800: '#093F3A',
          900: '#082F2B',
        },
        stone: {
          50:  '#FAF9F7',
          100: '#F4F2EE',
          200: '#E9E6E0',
          300: '#D8D3CB',
          400: '#B7B1A7',
          500: '#8C857A',
          600: '#6B6459',
          700: '#4E4840',
          800: '#332F2A',
          900: '#1F1C18',
        },
        clay: {
          500: '#C0654A',
          600: '#A2503A',
        },
      },
      borderRadius: {
        'md': '10px',
        'lg': '14px',
        'xl': '20px',
        '2xl': '28px',
      },
      boxShadow: {
        'sm':    '0 1px 3px rgba(31,28,24,0.07), 0 1px 2px rgba(31,28,24,0.04)',
        'md':    '0 4px 12px rgba(31,28,24,0.08), 0 2px 4px rgba(31,28,24,0.04)',
        'brand': '0 8px 20px rgba(15,110,102,0.22)',
      },
    },
  },
  plugins: [],
}