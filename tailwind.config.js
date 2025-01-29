/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#0B0F19',
        foreground: '#E2E8F0',
        primary: {
          DEFAULT: '#3B82F6',
          foreground: '#FFFFFF',
        },
        card: {
          DEFAULT: '#1E293B',
          foreground: '#E2E8F0',
        },
        border: '#2D3748',
        input: '#2D3748',
      },
    },
  },
  plugins: [],
}