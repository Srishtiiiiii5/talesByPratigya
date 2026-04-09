/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        cream: {
          50:  '#FDFAF6',
          100: '#F9F3E8',
          200: '#F0E8D5',
          300: '#E5D5BC',
          400: '#D4BC99',
          500: '#BFA07A',
        },
        gold: {
          300: '#E8C97A',
          400: '#D4A853',
          500: '#C9933A',
          600: '#A87830',
          700: '#8A6028',
        },
        ink: {
          50:  '#F5EDE0',
          100: '#D9C4A8',
          200: '#BFA689',
          300: '#8A7560',
          400: '#6B5744',
          500: '#4A3A2A',
          600: '#2E2218',
          700: '#1E1409',
          800: '#100C05',
          900: '#0A0804',
        },
        story: {
          light: '#FAF7F0',
          dark:  '#0F0D0A',
          card:  '#F5EDE0',
          'card-dark': '#1C1711',
        },
      },
      fontFamily: {
        serif:    ['"Playfair Display"', 'Georgia', 'serif'],
        devanagari: ['"Noto Serif Devanagari"', '"Lohit Devanagari"', 'serif'],
        sans:     ['"Inter"', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'paper-texture':   "url('/textures/paper.png')",
      },
      animation: {
        'fade-in':    'fadeIn 0.6s ease-out forwards',
        'fade-up':    'fadeUp 0.7s ease-out forwards',
        'slide-in':   'slideIn 0.5s ease-out forwards',
        'shimmer':    'shimmer 1.5s infinite',
        'float':      'float 3s ease-in-out infinite',
        'page-turn':  'pageTurn 0.4s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeUp: {
          '0%':   { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideIn: {
          '0%':   { opacity: '0', transform: 'translateX(-20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%':      { transform: 'translateY(-8px)' },
        },
        pageTurn: {
          '0%':   { opacity: '0', transform: 'rotateY(-5deg)' },
          '100%': { opacity: '1', transform: 'rotateY(0deg)' },
        },
      },
      boxShadow: {
        'card':        '0 4px 20px rgba(0,0,0,0.08)',
        'card-hover':  '0 12px 40px rgba(0,0,0,0.16)',
        'golden':      '0 4px 20px rgba(201,147,58,0.3)',
        'golden-lg':   '0 8px 32px rgba(201,147,58,0.4)',
        'inset-gold':  'inset 0 0 0 1px rgba(201,147,58,0.3)',
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {
            fontFamily: theme('fontFamily.sans').join(', '),
            lineHeight: '1.9',
            fontSize:   '1.125rem',
            color:      theme('colors.ink.700'),
            h1: { fontFamily: theme('fontFamily.serif').join(', ') },
            h2: { fontFamily: theme('fontFamily.serif').join(', ') },
            h3: { fontFamily: theme('fontFamily.serif').join(', ') },
          },
        },
      }),
    },
  },
  plugins: [],
}
