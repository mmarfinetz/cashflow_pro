/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary Colors
        'primary': '#10B981', // Emerald green (primary) - emerald-500
        'primary-50': '#ECFDF5', // Very light emerald - emerald-50
        'primary-100': '#D1FAE5', // Light emerald - emerald-100
        'primary-200': '#A7F3D0', // Medium light emerald - emerald-200
        'primary-600': '#059669', // Deeper emerald (secondary) - emerald-600
        'primary-700': '#047857', // Dark emerald - emerald-700
        'primary-800': '#065F46', // Very dark emerald - emerald-800
        'primary-900': '#064E3B', // Darkest emerald - emerald-900
        'accent': '#3B82F6', // Professional blue (accent) - blue-500
        
        // Background Colors
        'background': '#FAFAFA', // Warm neutral background - gray-50
        'surface': '#FFFFFF', // Pure white surface - white
        
        // Text Colors
        'text-primary': '#111827', // Near-black primary text - gray-900
        'text-secondary': '#6B7280', // Medium gray secondary text - gray-500
        
        // Status Colors
        'success': '#22C55E', // Vibrant green success - green-500
        'warning': '#F59E0B', // Amber warning - amber-500
        'error': '#EF4444', // Clear red error - red-500
        
        // Border Colors
        'border': '#E5E7EB', // Neutral gray border - gray-200
        'border-light': '#F3F4F6', // Light gray border - gray-100
        
        // Additional Gray Shades
        'gray-50': '#F9FAFB', // Very light gray - gray-50
        'gray-100': '#F3F4F6', // Light gray - gray-100
        'gray-200': '#E5E7EB', // Medium light gray - gray-200
        'gray-300': '#D1D5DB', // Medium gray - gray-300
        'gray-400': '#9CA3AF', // Medium dark gray - gray-400
        'gray-600': '#4B5563', // Dark gray - gray-600
        'gray-700': '#374151', // Very dark gray - gray-700
        'gray-800': '#1F2937', // Darkest gray - gray-800
      },
      fontFamily: {
        'sans': ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        'mono': ['JetBrains Mono', 'Courier New', 'monospace'],
      },
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1rem' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'base': ['1rem', { lineHeight: '1.5rem' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
      },
      fontWeight: {
        'normal': '400',
        'medium': '500',
        'semibold': '600',
        'bold': '700',
      },
      borderRadius: {
        'sm': '4px',
        'DEFAULT': '8px',
        'lg': '12px',
        'xl': '16px',
      },
      boxShadow: {
        'elevation-1': '0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)',
        'elevation-2': '0 4px 6px rgba(0, 0, 0, 0.07), 0 2px 4px rgba(0, 0, 0, 0.06)',
        'elevation-3': '0 10px 15px rgba(0, 0, 0, 0.1), 0 4px 6px rgba(0, 0, 0, 0.05)',
      },
      backdropBlur: {
        'xs': '2px',
        'sm': '4px',
        'DEFAULT': '10px',
        'lg': '16px',
      },
      transitionDuration: {
        '200': '200ms',
        '300': '300ms',
      },
      transitionTimingFunction: {
        'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
      spacing: {
        '18': '4.5rem',
        '84': '21rem',
      },
      zIndex: {
        '1000': '1000',
        '1005': '1005',
        '1010': '1010',
        '1020': '1020',
      },
      minHeight: {
        '44': '44px',
      },
      minWidth: {
        '44': '44px',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}