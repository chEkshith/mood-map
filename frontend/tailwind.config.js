/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  safelist: ["btn-cut", "btn-cut-border", "btn-cut-sm", "anim-stagger", "anim-fade"],
  theme: {
    extend: {
      fontFamily: {
        inter: ['"Plus Jakarta Sans"', "Inter", "sans-serif"],
        sans: ['"Plus Jakarta Sans"', "Inter", "system-ui", "sans-serif"],
        display: ["Outfit", "system-ui", "sans-serif"],
        brand: ['"Space Grotesk"', "system-ui", "sans-serif"],
        accent: ['"Plus Jakarta Sans"', "system-ui", "sans-serif"],
      },
      boxShadow: {
        glass: "0 24px 60px -12px rgba(2, 6, 23, 0.65), 0 8px 24px -8px rgba(2, 6, 23, 0.45), inset 0 1px 0 rgba(255,255,255,0.22)",
        "glass-sm": "0 12px 30px -10px rgba(2, 6, 23, 0.55), inset 0 1px 0 rgba(255,255,255,0.18)",
        glow: "0 0 40px -8px rgba(139, 92, 246, 0.55)",
      },
    },
  },
  plugins: [],
};
