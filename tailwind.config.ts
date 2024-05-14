/** @type {import('tailwindcss').Config} */

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    colors: {
      california: "#FDA00D",
      pomegranite: "#44336",
      rust: "#965247",
      seaBuckthorn: "#F9B32A",
      shipGray: "#3E3643",
      springWood: "#F4F5EB",
      stone: "#9F9B8F",
      sushi: "#80B045",
    },
    extend: {
      backgroundImage: {
        noise: "url('assets/images/noise.svg')",
      },
    },
    fontFamily: {
      enchant: ["Enchant", "serif"],
    },
  },
  plugins: [],
  important: true,
  corePlugins: {
    preflight: false,
  },
};
