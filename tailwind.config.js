/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./front/index.html",
    "./front/**/*.{html,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        h1: ['futura-pt'],
        body: ['meno-text']
      },
    },
  },
  plugins: [],
}

