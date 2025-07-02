/** @type {import('tailwindcss').Config} */
const defaultConfig = require("shadcn/ui/tailwind.config")

module.exports = {
  ...defaultConfig,
  content: [
    ...defaultConfig.content,
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    ...defaultConfig.theme,
    extend: {
      ...defaultConfig.theme.extend,
      colors: {
        ...defaultConfig.theme.extend.colors,
        "neutral-01": "#ffffff",
        "neutral-02": "#f8f8f8",
        "neutral-03": "#616161",
        "neutral-04": "#000000",
        "color-01": "#0865ff",
        "color-02": "#0101db",
        "color-03": "#e64240",
        "color-04": "#ff7442",
        blue: {
          500: "#0865ff",
          600: "#0865ff",
          800: "#000092",
        },
        orange: {
          500: "#ff7442",
        },
        red: {
          500: "#e64240",
        },
        gray: {
          50: "#f8f8f8",
          100: "#f0f0f0",
          200: "#e8e8e8",
          300: "#d0d0d0",
          400: "#a0a0a0",
          500: "#616161",
          600: "#4a4a4a",
          700: "#333333",
          800: "#1a1a1a",
          900: "#000000",
        },
        green: {
          500: "#10b981",
        },
      },
      fontFamily: {
        heading: ["Plus Jakarta Sans", "sans-serif"],
      },
      fontSize: {
        "6xl": ["90px", { lineHeight: "115%", letterSpacing: "-2px" }],
        "8xl": ["160px", { lineHeight: "115%", letterSpacing: "-2px" }],
        "9xl": ["160px", { lineHeight: "115%", letterSpacing: "-2px" }],
      },
      spacing: {
        15: "60px",
        13: "52px",
      },
      borderRadius: {
        ...defaultConfig.theme.extend.borderRadius,
        "3xl": "32px",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [...defaultConfig.plugins, require("tailwindcss-animate")],
}
