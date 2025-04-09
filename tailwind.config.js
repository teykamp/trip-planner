/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./src/**/*.{astro,html,js,jsx,ts,tsx,vue}'],
    theme: {
      extend: {
        colors: {
          space: {
            100: '#d1d5db',
            200: '#a1a1aa',
            400: '#6b7280',
            600: '#4b5563',
            800: '#1f2937',
            900: '#111827'
          },
          accent: {
            DEFAULT: '#a78bfa',
            soft: '#c4b5fd'
          }
        }
      }
    },
    plugins: []
  };
  