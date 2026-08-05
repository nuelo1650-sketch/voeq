/** Voeq brand color tokens — extended in a later prompt */
module.exports = {
  theme: {
    extend: {
      colors: {
        forest: {
          50: '#E8F0EB',
          100: '#C5D9CC',
          200: '#9DC2AB',
          300: '#75AA8A',
          400: '#549370',
          500: '#347B57',
          600: '#1F5E40',
          700: '#0F3D2E',
          800: '#0A2E22',
          900: '#061F17',
        },
        gold: {
          50: '#FBF6E8',
          100: '#F5E9C3',
          200: '#EDD999',
          300: '#E5CA70',
          400: '#DDBE55',
          500: '#C9A24B',
          600: '#A8843C',
          700: '#87662E',
          800: '#664A21',
          900: '#453015',
        },
        cream: {
          50: '#FDFCFA',
          100: '#F7F5F0',
          200: '#EFEBE0',
          300: '#E5DECC',
          400: '#D5CAA8',
        },
      },
      fontFamily: {
        sans: ['var(--font-geist-sans)', 'system-ui', 'sans-serif'],
        serif: ['var(--font-fraunces)', 'Georgia', 'serif'],
        mono: ['var(--font-geist-mono)', 'monospace'],
      },
    },
  },
};
