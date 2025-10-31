/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
    './src/**/*.{html,js,ts,jsx,tsx}',
    './public/**/*.{html,js}',
    './**/*.html',
    './pages/**/*.html',
    './*.html'
  ],
  theme: {
    extend: {
      keyframes: {
        'slide-in': {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        contentOut: {
          to: {
            transform: 'translateY(-150%)',
            filter: 'blur(20px)',
            opacity: '0',
          },
        },
      },
      animation: {
        'content-out': 'contentOut 1.5s linear forwards',
        'slide-in': 'slide-in 650ms cubic-bezier(.22,.9,.36,1) forwards',
      },
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
      },
      colors: {
        background: '#000',
        text: '#eee',
      },
    },
  },
  plugins: [],
}