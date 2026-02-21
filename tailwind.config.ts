import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0d7ff2',
        'primary-dark': '#0b6bcb',
        'signal-red': '#E03A2F',
        'background-light': '#f5f7f8',
        'background-dark': '#101922',
        'surface-dark': '#1a2632',
        'surface-border': '#382a29',
        'border-dark': '#382a29',
        'blueprint-blue': '#2b6cb0',
        'blueprint-hover': '#2c5282',
        'amber-badge': '#C97B1A',
        'cream': '#EDEAD3',
        'ink': '#111418',
        'stone': '#60758a',
        'secondary-blue': '#2b4c7e',
      },
      fontFamily: {
        display: ['Space Grotesk', 'Manrope', 'Plus Jakarta Sans', 'Syne', 'Work Sans', 'sans-serif'],
        serif: ['DM Serif Display', 'serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      backgroundImage: {
        'grid-pattern': "linear-gradient(to right, rgba(17, 20, 24, 0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(17, 20, 24, 0.04) 1px, transparent 1px)",
        'grid': "linear-gradient(to right, rgba(17, 20, 24, 0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(17, 20, 24, 0.04) 1px, transparent 1px)",
      },
      animation: {
        'pop-in': 'popIn 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards',
        'slide-up': 'slideUp 0.8s ease-out 0.2s forwards',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        popIn: {
          '0%': { opacity: '0', transform: 'scale(0.5)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
    },
  },
  plugins: [],
}

export default config
