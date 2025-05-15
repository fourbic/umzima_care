/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          dark: '#020532',    // Primary Dark Blue (Background, Navigation)
          secondary: '#030533',  // Secondary Dark Blue (Accents, Darker UI elements)
          bright: '#14E323',  // Primary Bright Green (Buttons, CTAs, Highlights)
        },
        accent: {
          'green-1': '#74E102', // Secondary Highlights, Icons
          'green-2': '#7FE201', // Subtle Highlights, Status Indicators
        },
        neutral: {
          white: '#FFFFFF',     // Text on dark backgrounds, card backgrounds
          'light-gray': '#E5E7EB', // Borders, subtle dividers, disabled states
          'medium-gray': '#6B7280', // Secondary text, icons
        },
        error: {
          red: '#EF4444',       // Validation errors, alerts
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      transitionProperty: {
        'height': 'height',
        'spacing': 'margin, padding',
      }
    },
  },
  plugins: [],
};