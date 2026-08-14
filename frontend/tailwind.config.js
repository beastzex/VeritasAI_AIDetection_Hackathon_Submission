/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        tg: {
          primary: '#000000',
          ink: '#000000',
          body: '#959494',
          hairline: '#ebebeb',
          'hairline-dark': '#26263a',
          canvas: '#ffffff',
          'canvas-dark': '#010120',
          'surface-dark-soft': '#313641',
          'on-dark': '#ffffff',
          orange: '#fc4c02',
          magenta: '#ef2cc1',
          periwinkle: '#bdbbff',
          mint: '#c8f6f9',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'Helvetica Neue', 'Arial', 'sans-serif'],
        mono: ['JetBrains Mono', 'PP Neue Montreal Mono', 'SF Mono', 'Menlo', 'monospace'],
      },
      borderRadius: {
        'xs': '3.25px',
        'sm': '4px',
        'md': '8px',
      }
    },
  },
  plugins: [],
}
