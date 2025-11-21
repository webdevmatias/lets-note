/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",     // App na raiz
    "./src/**/*.{js,jsx,ts,tsx}" // tudo dentro de src (screens, components, etc)
  ],

  presets: [require("nativewind/preset")],
  theme: {
    extend: {},
  },
  plugins: [],
};
