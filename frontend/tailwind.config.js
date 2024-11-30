/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",  // all JS/JSX/TS/TSX files in src
    "./src/components/**/*.{js,jsx,ts,tsx}",  // specifically your components
    // Based on your files:
    "./src/components/SecurityCheckAvatar/**/*.{js,jsx}",
    "./src/components/GuardAvatar/**/*.{js,jsx}",
    "./src/components/CircularProgress/**/*.{js,jsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      keyframes: {
        scanning: {
          '0%, 100%': { transform: 'translateY(-30px)' },
          '50%': { transform: 'translateY(30px)' }
        },
        'spin-slow': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' }
        },
        'corner-pulse': {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.5 }
        },
        'face-scan': {
          '0%': { transform: 'translateY(-40px)', opacity: 0 },
          '50%': { transform: 'translateY(0px)', opacity: 1 },
          '100%': { transform: 'translateY(40px)', opacity: 0 }
        },
        'success-pop': {
          '0%': { 
            transform: 'scale(0.8)',
            opacity: 0 
          },
          '50%': { 
            transform: 'scale(1.1)'
          },
          '100%': { 
            transform: 'scale(1)',
            opacity: 1 
          }
        },
        'error-bounce': {
          '0%, 100%': { 
            transform: 'scale(1)',
          },
          '33%': { 
            transform: 'scale(1.1) rotate(3deg)'
          },
          '66%': { 
            transform: 'scale(1.1) rotate(-3deg)'
          }
        }
      },
      animation: {
        'spin-slow': 'spin-slow 4s linear infinite',
        'corner-pulse': 'corner-pulse 2s ease-in-out infinite',
        'face-scan': 'face-scan 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'success-pop': 'success-pop 0.5s ease-out forwards',
        'error-bounce': 'error-bounce 0.5s ease-in-out',
        'scanning': 'scanning 2s ease-in-out infinite'
      }
    }
  },
  plugins: [require("tailwindcss-animate")],
}