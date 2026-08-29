import type { Config } from 'tailwindcss';

export default {
  content: ['./src/**/*.{html,ts}'],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: '#03213a',
          50: '#eef5fa',
          100: '#d9e8f2',
          700: '#0a304d',
          900: '#03213a',
        },
        premium: {
          gold: '#b89a63',
          paper: '#f5f3ee',
          ink: '#10283a',
          muted: '#647582',
          line: '#dce2e5',
        },
      },
      fontFamily: {
        sans: ['Manrope', 'Arial', 'sans-serif'],
        display: ['Prata', 'Georgia', 'serif'],
      },
      boxShadow: {
        premium: '0 24px 70px rgba(3, 33, 58, 0.10)',
        card: '0 16px 44px rgba(3, 33, 58, 0.08)',
      },
      borderRadius: {
        premium: '1.5rem',
      },
    },
  },
  plugins: [],
} satisfies Config;
