/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1D4ED8', // Custom blue color
      },
      fontFamily: {
        sans: ['Inter', 'Arial', 'sans-serif'], // Custom font
      },
    },
  },
  plugins: [
    require('tailwindcss'),
    require('autoprefixer'),
  ],}

