/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",   // ← to jest kluczowe!
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
