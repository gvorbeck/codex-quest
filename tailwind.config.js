/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class", // Enable dark mode
  theme: {
    extend: {
      colors: {
        // Primary color scheme
        primary: {
          50: "#fafafa", // zinc-50
          100: "#f4f4f5", // zinc-100
          200: "#e4e4e7", // zinc-200
          300: "#d4d4d8", // zinc-300
          400: "#a1a1aa", // zinc-400
          500: "#71717a", // zinc-500
          600: "#52525b", // zinc-600
          700: "#3f3f46", // zinc-700 - main color
          800: "#27272a", // zinc-800
          900: "#18181b", // zinc-900
          950: "#09090b", // zinc-950
        },
        // Highlight/interactive colors
        highlight: {
          50: "#fffbeb", // amber-50
          100: "#fef3c7", // amber-100
          200: "#fde68a", // amber-200
          300: "#fcd34d", // amber-300
          400: "#fbbf24", // amber-400 - main highlight
          500: "#f59e0b", // amber-500
          600: "#d97706", // amber-600
          700: "#b45309", // amber-700
          800: "#92400e", // amber-800
          900: "#78350f", // amber-900
          950: "#451a03", // amber-950
        },
        // Accent colors
        accent: {
          50: "#fafaf9", // stone-50
          100: "#f5f5f4", // stone-100 - main accent
          200: "#e7e5e4", // stone-200
          300: "#d6d3d1", // stone-300
          400: "#a8a29e", // stone-400
          500: "#78716c", // stone-500
          600: "#57534e", // stone-600
          700: "#44403c", // stone-700
          800: "#292524", // stone-800
          900: "#1c1917", // stone-900
          950: "#0c0a09", // stone-950
        },
        // Background colors for easy reference
        background: {
          primary: "#18181b", // zinc-900
          secondary: "#27272a", // zinc-800
          tertiary: "#3f3f46", // zinc-700
        },
        // Text colors for easy reference
        text: {
          primary: "#f4f4f5", // zinc-100
          secondary: "#a1a1aa", // zinc-400
          muted: "#71717a", // zinc-500
        },
        // Border colors
        border: {
          DEFAULT: "#52525b", // zinc-600
          light: "#71717a", // zinc-500
        },
      },
      // Custom box shadows with theme colors
      boxShadow: {
        focus: "0 0 0 2px rgba(251, 191, 36, 0.2)", // amber-400 with opacity
        highlight: "0 0 0 2px rgba(251, 191, 36, 0.5)",
      },
      // Custom animations for interactive elements
      animation: {
        "fade-in": "fadeIn 0.2s ease-in-out",
        "slide-up": "slideUp 0.3s ease-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(10px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};
