/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: {
          primary:   "#0A0A0A",
          secondary: "#111111",
          tertiary:  "#1A1A1A",
        },
        accent: {
          primary:   "#00FF87",
          secondary: "#00CC6A",
          danger:    "#FF3B3B",
          warning:   "#FFB800",
          info:      "#3B82F6",
        },
        brand: {
          dark: "#050c07",
        },
        text: {
          primary:   "#FFFFFF",
          secondary: "#A1A1AA",
          muted:     "#52525B",
        },
        border: {
          DEFAULT: "#1F1F1F",
          focus:   "#00FF87",
          error:   "#FF3B3B",
        },
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
      borderRadius: {
        "xl":  "12px",
        "2xl": "16px",
        "3xl": "24px",
        "4xl": "32px",
      },
      backdropBlur: {
        xs: "2px",
      },
      animation: {
        "pulse-slow": "pulse 3s ease-in-out infinite",
        "glow":       "glow 3s ease-in-out infinite",
        "float":      "float 6s ease-in-out infinite",
        "dot-blink":  "dotBlink 1.5s ease-in-out infinite",
      },
      keyframes: {
        glow: {
          "0%, 100%": { opacity: "0.08" },
          "50%":      { opacity: "0.04" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%":      { transform: "translateY(-10px)" },
        },
        dotBlink: {
          "0%, 100%": { opacity: "1" },
          "50%":      { opacity: "0" },
        },
      },
      boxShadow: {
        "neon-sm": "0 0 8px rgba(0,255,135,0.3)",
        "neon":    "0 0 20px rgba(0,255,135,0.4)",
        "neon-lg": "0 0 40px rgba(0,255,135,0.3)",
        "card":    "0 24px 80px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.06)",
        "btn":     "0 4px 20px rgba(0,255,135,0.3)",
        "btn-hover":"0 8px 30px rgba(0,255,135,0.5)",
      },
    },
  },
  plugins: [],
};
