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
      // New modern colors
      mysticPurple: "#6B46C1",
      emberOrange: "#F97316",
      forestGreen: "#059669",
      deepBlue: "#1E40AF",
      crimsonRed: "#DC2626",
    },
    extend: {
      backgroundImage: {
        noise: "url('assets/images/noise.svg')",
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "hero-pattern":
          "linear-gradient(135deg, #F9B32A 0%, #FDA00D 50%, #965247 100%)",
        "card-glow":
          "linear-gradient(145deg, rgba(249, 179, 42, 0.1) 0%, rgba(253, 160, 13, 0.1) 100%)",
        "dark-gradient":
          "linear-gradient(135deg, #3E3643 0%, #2D2A35 50%, #1F1B25 100%)",
      },
      boxShadow: {
        glow: "0 0 20px rgba(249, 179, 42, 0.3)",
        "glow-lg": "0 0 40px rgba(249, 179, 42, 0.4)",
        card: "0 4px 20px rgba(0, 0, 0, 0.1)",
        "card-hover": "0 8px 30px rgba(0, 0, 0, 0.15)",
        "inner-glow": "inset 0 1px 3px rgba(249, 179, 42, 0.2)",
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-in-out",
        "slide-up": "slideUp 0.6s ease-out",
        "pulse-glow": "pulseGlow 2s ease-in-out infinite",
        float: "float 3s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(30px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        pulseGlow: {
          "0%, 100%": { boxShadow: "0 0 20px rgba(249, 179, 42, 0.3)" },
          "50%": { boxShadow: "0 0 30px rgba(249, 179, 42, 0.6)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
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
