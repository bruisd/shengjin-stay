import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#D3AC51",
        "admin-primary": "#6326a1",
        "background-light": "#f6f8f8",
        "background-dark": "#12201e",
        "surface-light": "#ffffff",
        "surface-dark": "#1a2c29",
        "text-main": "#121716",
        "text-secondary": "#668580",
        "border-light": "#e0e8e6",
        "border-dark": "#2c4a45",
        "coral-blush": "#E07B6C",
      },
      fontFamily: {
        display: ["Space Grotesk", "sans-serif"],
        body: ["Libre Franklin", "sans-serif"],
        admin: ["Plus Jakarta Sans", "sans-serif"],
      },
      borderRadius: {
        DEFAULT: "0px",
        lg: "0px",
        xl: "0px",
        full: "0px",
        "admin": "0.5rem",
        "admin-lg": "1rem",
        "admin-xl": "1.5rem",
        "admin-full": "9999px",
      },
    },
  },
  plugins: [],
};
export default config;
