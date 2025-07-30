/** @type {import('tailwindcss').Config} */
const { fontFamily } = require("tailwindcss/defaultTheme");
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      sans: ["DM Sans", ...fontFamily.sans],
      gothic: ["Special Gothic Expanded One"],

    },
  },
  plugins: [],
}
