/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './templates/**/*.{html.twig,twig}',
    './modules/**/*.{html.twig,twig}',
    './*.theme',
    './js/**/*.js',
    './*.html',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Add custom colors if needed
      },
      fontFamily: {
        // Add custom fonts if needed
      },
    },
  },
  plugins: [],
}
