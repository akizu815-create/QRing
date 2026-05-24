import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ivory: "#F7F4EE",
        cream: "#EFE9DD",
        sand: "#E2D7C2",
        ink: "#1F1A14",
        moss: "#5B6E4F",
        deepmoss: "#3F4F36",
        gold: "#B8954B",
        softgold: "#D6B97A",
      },
      fontFamily: {
        serif: ["var(--font-cormorant)", "var(--font-noto-serif)", "serif"],
        sans: ["var(--font-noto-sans)", "system-ui", "sans-serif"],
      },
      letterSpacing: {
        widest2: "0.3em",
      },
      animation: {
        "fade-up": "fadeUp 1.2s ease-out forwards",
        "fade-in": "fadeIn 1.6s ease-out forwards",
        "slow-zoom": "slowZoom 14s ease-out forwards",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slowZoom: {
          "0%": { transform: "scale(1.08)" },
          "100%": { transform: "scale(1.0)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
