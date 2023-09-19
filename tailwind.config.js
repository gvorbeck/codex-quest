/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        springWood: "#F4F5EB",
        zorba: "#9F9B8F",
        seaBuckthorn: "#F9B32A",
        copperRust: "#965247",
        shipGray: "#3E3643",
      },
      flex: {
        25: "1 1 25%",
      },
      screens: {
        lg: "992px",
        sm: "450px",
        print: { raw: "print" },
      },
      fontFamily: {
        enchant: ["Enchant", "serif"],
      },
    },
  },
  plugins: ["tailwindcss ,autoprefixer"],
  corePlugins: {
    preflight: false,
  },
  important: true,
};
