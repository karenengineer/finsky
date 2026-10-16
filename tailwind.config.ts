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
        sky: '#2440d6',
        premium: {
          gold: '#f59e2b',
          paper: '#f3f5fa',
          ink: '#0b1026',
          muted: '#596274',
          line: '#dce2eb',
        },
      },
      fontFamily: {
        sans: ['Noto Sans Armenian', 'Noto Sans', 'Segoe UI', 'Sylfaen', 'Arial', 'sans-serif'],
        display: ['Noto Sans Armenian', 'Noto Sans', 'Segoe UI', 'Sylfaen', 'Arial', 'sans-serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'Consolas', 'monospace'],
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
