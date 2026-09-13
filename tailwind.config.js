/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        italian: {
          green: "#009246",
          white: "#F4F5F0",
          red: "#CE2B37",
          gold: "#F59E0B",
          darkNavy: "#0F172A",
          cardDark: "#1E293B",
          accentPink: "#F43F5E",
        }
      },
      animation: {
        'pulse-fast': 'pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'flame-glow': 'flameGlow 1.5s ease-in-out infinite alternate',
        'heart-beat': 'heartBeat 1.2s ease-in-out infinite',
      },
      keyframes: {
        flameGlow: {
          '0%': { filter: 'drop-shadow(0 0 4px rgba(245, 158, 11, 0.6))', transform: 'scale(1)' },
          '100%': { filter: 'drop-shadow(0 0 16px rgba(239, 68, 68, 0.9))', transform: 'scale(1.08)' }
        },
        heartBeat: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.15)' }
        }
      }
    },
  },
  plugins: [],
}
