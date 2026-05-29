/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        loom: {
          bg:      '#0a0f1e',
          card:    '#131929',
          raised:  '#1a2540',
          border:  '#243050',
          gold:    '#c9a227',
          gold2:   '#e0bc45',
          cream:   '#f5f0e8',
          muted:   '#9a8f84',
          rust:    '#8b3a2a',
          rust2:   '#b04a35',
          sage:    '#3d6b48',
          sage2:   '#4e8a5e',
          error:   '#8b2020',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'shimmer': 'shimmer 2s linear infinite',
        'pulse-gold': 'pulse-gold 1.5s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition: '200% center' },
        },
        'pulse-gold': {
          '0%, 100%': { boxShadow: '0 0 8px rgba(201,162,39,0.4)' },
          '50%': { boxShadow: '0 0 20px rgba(201,162,39,0.8)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        },
      },
      backgroundImage: {
        'weave-texture': `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Crect x='0' y='0' width='10' height='10' fill='rgba(201,162,39,0.03)'/%3E%3Crect x='10' y='10' width='10' height='10' fill='rgba(201,162,39,0.03)'/%3E%3C/svg%3E")`,
      },
    },
  },
  plugins: [],
}
